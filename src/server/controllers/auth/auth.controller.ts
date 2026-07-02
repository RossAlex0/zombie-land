import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '../../../utils/api/cookies';
import { COOKIE_NAMES } from '@customTypes/enum/cookies';
import { RefreshTokenModel, UserModel } from '@server/services';
import { loginSchema, signupSchema } from '@server/schemas/user/user.schema';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { ZodError } from 'zod';
import { generateAccessToken, generateRefreshToken } from '../../../utils/api/token';
import { buildGoogleClient } from '@lib/google';
import { booking, role, user } from '@prismaInstance/*';
import { NotFoundError, UnauthorizedError } from '../../../utils/errors/errors';

const OAUTH_STATE_MAX_AGE = 60 * 10; // 10 min : durée de vie du cookie anti-CSRF

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

  /**
   * GET /api/auth/google
   * Redirige vers l'écran de consentement Google.
   * On dépose un `state` aléatoire en cookie httpOnly pour se protéger du CSRF.
   */
  googleRedirect: async (req: NextRequest) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) {
      console.error(
        'Google OAuth non configuré (GOOGLE_CLIENT_ID / GOOGLE_REDIRECT_URI manquants)'
      );
      return NextResponse.redirect(new URL('/auth/login?error=google', req.nextUrl.origin));
    }

    const state = randomBytes(16).toString('hex');

    const authUrl = buildGoogleClient().generateAuthUrl({
      scope: ['openid', 'email', 'profile'],
      state,
      prompt: 'select_account',
    });

    const response = NextResponse.redirect(authUrl);

    response.cookies.set(COOKIE_NAMES.OAUTH_STATE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: OAUTH_STATE_MAX_AGE,
    });

    return response;
  },

  /**
   * GET /api/auth/google/callback
   * Google renvoie ici avec un `code`. On l'échange contre les tokens, on vérifie
   * cryptographiquement le id_token, puis on résout l'utilisateur (par google_id,
   * sinon par email vérifié, sinon création) et on émet NOS tokens JWT.
   */
  googleCallback: async (req: NextRequest) => {
    const loginUrl = new URL('/auth/login?error=google', req.nextUrl.origin);

    try {
      const code = req.nextUrl.searchParams.get('code');
      const state = req.nextUrl.searchParams.get('state');
      const storedState = req.cookies.get(COOKIE_NAMES.OAUTH_STATE)?.value;

      // Vérification anti-CSRF : le state renvoyé par Google doit matcher notre cookie.
      if (!code || !state || !storedState || state !== storedState) {
        return NextResponse.redirect(loginUrl);
      }

      const client = buildGoogleClient();

      // 1. Échange du code contre les tokens Google
      const { tokens } = await client.getToken(code);

      if (!tokens.id_token) {
        console.error('id_token absent de la réponse Google');
        return NextResponse.redirect(loginUrl);
      }

      // 2. Vérification cryptographique du id_token (signature Google + audience)
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload?.sub || !payload.email) {
        return NextResponse.redirect(loginUrl);
      }

      // 3. Résolution de l'utilisateur
      const userService = new UserModel();

      let userId: number;
      let roleId: number;

      // 3a. Déjà connu via son google_id -> connexion directe
      const byGoogleId = await userService.findUserByGoogleId(payload.sub);

      if (byGoogleId) {
        userId = byGoogleId.id;
        roleId = byGoogleId.role.id;
      } else {
        // 3b. Un compte existe déjà avec cet email
        const byEmail = await userService.findUserByEmail(payload.email);

        if (byEmail) {
          // On ne rattache que si Google a vérifié l'email (anti-prise de contrôle de compte).
          if (!payload.email_verified) {
            return NextResponse.redirect(loginUrl);
          }
          await userService.linkGoogleId(byEmail.id, payload.sub);
          userId = byEmail.id;
          roleId = byEmail.role.id;
        } else {
          // 3c. Nouveau compte. Sans mot de passe côté Google : on stocke un hash
          // argon2 aléatoire (aucune saisie ne pourra le matcher, login classique bloqué).
          const randomPassword = await argon2.hash(randomBytes(32).toString('hex'));

          const created = await userService.create({
            data: {
              email: payload.email,
              first_name: payload.given_name ?? 'Utilisateur',
              last_name: payload.family_name ?? 'Google',
              password: randomPassword,
              valid_email: payload.email_verified ?? false,
              google_id: payload.sub,
            },
            select: { id: true, role_id: true },
          });

          userId = created.id;
          roleId = created.role_id;
        }
      }

      // 4. Émission de NOS tokens + pose des cookies (réutilise l'infra existante)
      const accessToken = await generateAccessToken(userId, roleId);
      const refreshToken = await generateRefreshToken(userId);

      const response = NextResponse.redirect(new URL('/', req.nextUrl.origin));
      setAuthCookies(response, { accessToken, refreshToken });
      response.cookies.delete(COOKIE_NAMES.OAUTH_STATE);

      return response;
    } catch (err) {
      console.error('Erreur callback Google:', err);
      return NextResponse.redirect(loginUrl);
    }
  },
};
