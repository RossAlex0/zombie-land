import { COOKIE_NAMES } from '@customTypes/enum/cookies';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError } from '../../errors/errors';
import { NextContext } from '@customTypes/nextApi';
import { Controller } from '@helpers/withErrorHandler';
import { UserModel } from '@server/services';
import { AccessTokenPayload } from '@customTypes/token';

const secret = process.env.JWT_SECRET as string;

export function verifyAccessToken<T>(controller: Controller<T>) {
  return async (req: NextRequest, context: NextContext<T>): Promise<NextResponse> => {
    const token = req.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

    if (!token) {
      throw new UnauthorizedError('No token access');
    }

    try {
      const payload = jwt.verify(token, secret) as AccessTokenPayload;

      const userService = new UserModel();

      const user = await userService.findUserById(payload.userId, { password_changed_at: true });

      if (user?.password_changed_at && payload.iat * 1000 < user.password_changed_at.getTime()) {
        throw new UnauthorizedError('Token invalidé par changement de mot de passe');
      }
    } catch {
      throw new UnauthorizedError('Token access is expired');
    }

    return await controller(req, context);
  };
}
