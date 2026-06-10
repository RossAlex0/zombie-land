import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '../../../utils/api/cookies';
import { COOKIE_NAMES } from '@customTypes/enum/cookies';
import { RefreshTokenModel, UserModel } from '@server/services';
import { loginSchema, signupSchema } from '@server/schemas/user/user.schema';
import argon2 from 'argon2';
import { ZodError } from 'zod';
import { generateAccessToken, generateRefreshToken } from '../../../utils/api/token';
import { user } from '../../../../prisma/generated/client';

export const authController = {
  signup: async (req: NextRequest) => {
    try {
      const userData: Partial<user> & { confirmPassword: string } = await req.json();
      if (!userData) {
        throw new Error('User data missing');
      }
      const { password, confirmPassword, ...userToCreate } = signupSchema.parse(userData);
      if (password !== confirmPassword) throw new Error('Les mots de passes ne correspondent pas');

      const hash = await argon2.hash(password);
      const data = { data: { ...userToCreate, password: hash }, omit: { password: true } };

      const userService = new UserModel();

      const addedUser = await userService.create(data);
      const accessToken = await generateAccessToken(addedUser.id, addedUser.role_id);
      const refreshToken = await generateRefreshToken(addedUser.id);

      const response = NextResponse.json({ message: 'Inscription réussie' }, { status: 200 });

      setAuthCookies(response, {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });

      return response;
    } catch (err) {
      // Validation : on laisse withErrorHandler renvoyer le détail par champ
      if (err instanceof ZodError) throw err;

      console.error(err);

      // On ne révèle pas qu'un email est déjà pris (évite l'énumération de comptes)
      // ni le message brut de Prisma : message générique.
      return NextResponse.json({ message: "Problème lors de l'inscription" }, { status: 400 });
    }
  },

  login: async (request: NextRequest) => {
    const body = await request.json();

    // Validation Zod : une ZodError remonte à withErrorHandler -> 400 lisible
    const { email, password } = loginSchema.parse(body);
    //   const result = await authService.loginUser(email, password);

    const userService = new UserModel();

    const user = await userService.findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const { password: userPassword, ...userWithoutPassword } = user;

    const isMatch = await argon2.verify(userPassword, password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const accessToken = await generateAccessToken(user.id, user.role.id);
    const refreshToken = await generateRefreshToken(user.id);

    const response = NextResponse.json(
      { message: 'Logged in successfully', user: userWithoutPassword },
      { status: 200 }
    );

    setAuthCookies(response, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    return response;
  },

  logout: async (req: NextRequest) => {
    try {
      const refreshTokenId = req.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

      if (refreshTokenId) {
        const refreshTokenService = new RefreshTokenModel();
        await refreshTokenService.deleteMany(refreshTokenId);
      }

      const response = NextResponse.json({ message: 'Déconnexion réussie' }, { status: 200 });

      response.cookies.delete(COOKIE_NAMES.ACCESS_TOKEN);
      response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);

      return response;
    } catch (err) {
      console.error('Erreur logout:', err);
      const response = NextResponse.json({ message: 'Déconnexion effectuée' }, { status: 200 });
      response.cookies.delete(COOKIE_NAMES.ACCESS_TOKEN);
      response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);
      return response;
    }
  },

  resetPassword: async (request: NextRequest) => {
    const userService = new UserModel();
    const { email } = await request.json();

    const user = await userService.findUserByEmail(email);

    if (user) {
      // TODO: générer token + stocker en BDD + envoyer email
    }

    return NextResponse.json({ message: 'Password reset link sent' }, { status: 200 });
  },
};
