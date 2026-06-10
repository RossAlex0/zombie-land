import { NextRequest, NextResponse } from 'next/server';
import { RefreshTokenModel, UserModel } from '@server/services';
import { getTokenAccess } from '../../../utils/api/token';
import argon2 from 'argon2';
import { updatePasswordSchema, updateUserSchema } from '@server/schemas/user/user.schema';
import { COOKIE_NAMES } from '@customTypes/enum/cookies';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../utils/errors/errors';

const userFields = {
  id: true,
  email: true,
  first_name: true,
  last_name: true,
  birth_date: true,
  role: true,
  created_at: true,
  deleted_at: true,
};

export const userController = {
  me: async (req: NextRequest) => {
    const token = getTokenAccess(req);

    const userService = new UserModel();

    const user = await userService.findUserById(token.userId, userFields);

    if (!user || user.deleted_at) {
      throw new NotFoundError('User not found');
    }

    return NextResponse.json(user);
  },

  updateMe: async (req: NextRequest) => {
    const token = getTokenAccess(req);

    if (!token.userId) {
      throw new UnauthorizedError('Invalid or missing user in access token.');
    }

    const body = await req.json();
    const userService = new UserModel();

    const bodyParsed = updateUserSchema.parse(body);

    const user = await userService.update({
      where: { id: token.userId },
      data: bodyParsed,
      select: userFields,
    });

    return NextResponse.json({ data: user, message: 'User has been updated.' }, { status: 200 });
  },

  updatePassword: async (req: NextRequest) => {
    const token = getTokenAccess(req);
    const body = await req.json();
    const userService = new UserModel();

    const { oldPassword, password } = updatePasswordSchema.parse(body);

    const user = await userService.findUserById(token.userId, { password: true });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!(await argon2.verify(user.password, oldPassword))) {
      throw new UnauthorizedError('Old password is incorrect');
    }

    if (oldPassword === password) {
      throw new BadRequestError('New password must be different from the old one');
    }

    const hash = await argon2.hash(password);

    await userService.update({
      where: { id: token.userId },
      data: {
        password: hash,
        password_changed_at: new Date(),
      },
    });

    // After password update, log out all sessions except the current one
    const refreshTokenService = new RefreshTokenModel();

    const currentRefreshToken = req.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

    if (currentRefreshToken) {
      await refreshTokenService.deleteAllForUserExceptToken(token.userId, currentRefreshToken);
    } else {
      await refreshTokenService.deleteAllForUser(token.userId);
    }

    return NextResponse.json({ message: 'Password updated successfully' });
  },

  deleteMe: async (req: NextRequest) => {
    const token = getTokenAccess(req);
    const userService = new UserModel();
    await userService.anonymizeUser(token.userId);

    const response = NextResponse.json({ message: 'Compte anonymisé avec succès' });
    // Déconnexion immédiate : l'access token (JWT) reste valide sinon jusqu'à expiration
    response.cookies.delete(COOKIE_NAMES.ACCESS_TOKEN);
    response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);
    return response;
  },
};
