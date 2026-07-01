import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '../../../utils/api/cookies';
import { COOKIE_NAMES } from '@customTypes/enum/cookies';
import { RefreshTokenModel, UserModel } from '@server/services';
import { loginSchema, signupSchema } from '@server/schemas/user/user.schema';
import argon2 from 'argon2';
import { ZodError } from 'zod';
import { generateAccessToken, generateRefreshToken } from '../../../utils/api/token';
import { booking, role, user } from '@prismaInstance/*';
import { NotFoundError, UnauthorizedError } from '../../../utils/errors/errors';

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

  login: async (req: NextRequest) => {
    const body = await req.json();

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
        await refreshTokenService.delete({ where: { token: refreshTokenId } });
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

  resetPassword: async (req: NextRequest) => {
    const userService = new UserModel();
    const { email } = await req.json();

    const user = await userService.findUserByEmail(email);

    if (user) {
      // TODO: générer token + stocker en BDD + envoyer email
    }

    return NextResponse.json({ message: 'Password reset link sent' }, { status: 200 });
  },

  refresh: async (req: NextRequest) => {
    const refreshTokenId = req.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

    if (!refreshTokenId) {
      throw new UnauthorizedError('No Refresh token access');
    }

    const refreshTokenService = new RefreshTokenModel();

    const refreshToken = await refreshTokenService.readOneByToken(refreshTokenId);

    if (!refreshToken || !refreshToken?.user_id) {
      throw new UnauthorizedError('Refresh token invalide.');
    }

    if (refreshToken.expired_at < new Date()) {
      await refreshTokenService.delete({ where: { token: refreshTokenId } });
      throw new UnauthorizedError('Refresh token expiré');
    }

    const userService = new UserModel();

    const user = await userService.findUserById(refreshToken.user_id, {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      booking: true,
      birth_date: true,
    });

    if (!user) {
      throw new NotFoundError('User associated with the refresh token was not found.');
    }

    const userTyped = user as user & { role: role; booking: booking };

    await refreshTokenService.delete({ where: { token: refreshTokenId } });

    const accessToken = await generateAccessToken(userTyped.id, userTyped.role.id);
    const newRefreshToken = await generateRefreshToken(userTyped.id);

    const response = NextResponse.json(
      { message: 'Token refreshed.', user: userTyped },
      { status: 200 }
    );

    setAuthCookies(response, {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    });

    return response;
  },
};
