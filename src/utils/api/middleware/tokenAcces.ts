import { COOKIE_NAMES } from '@customTypes/enum/cookies';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { UnauthorizedError } from '../../errors/errors';
import { NextContext } from '@customTypes/nextApi';
import { Controller } from '@helpers/withErorrHandler';

const secret = process.env.JWT_SECRET as string;

export type AccessTokenPayload = { userId: number; role: number };

export function verifyAccessToken<T>(controller: Controller<T>) {
  return async (req: NextRequest, context: NextContext<T>): Promise<NextResponse> => {
    const token = req.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

    if (!token) {
      throw new UnauthorizedError('No token access');
    }

    try {
      const isAuthorized = jwt.verify(token, secret) as AccessTokenPayload;

      if (!isAuthorized) {
        throw new UnauthorizedError('Token access is expired');
      }

      return await controller(req, context);
    } catch {
      throw new UnauthorizedError('Token access is expired');
    }
  };
}
