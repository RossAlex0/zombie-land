import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { prisma } from '@prismaInstance/*';
import { NextRequest } from 'next/server';
import { COOKIE_NAMES } from '@customTypes/enum/cookies';
import { AccessTokenPayload } from '@customTypes/token';

const ACCESS_TOKEN_TTL = '8h';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const secret = process.env.JWT_SECRET as string;

export const generateAccessToken = async (userId: number, role: number): Promise<string> => {
  return jwt.sign({ userId, role }, secret, {
    algorithm: 'HS256',
    expiresIn: ACCESS_TOKEN_TTL,
  });
};

export const generateRefreshToken = async (userId: number): Promise<string> => {
  const token = randomBytes(64).toString('hex');
  const expired_at = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await prisma.refresh_token.create({
    data: { token, user_id: userId, expired_at },
  });

  return token;
};

export const getTokenAccess = (req: NextRequest) => {
  const token = req.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value as string;

  return jwt.verify(token, secret) as AccessTokenPayload;
};
