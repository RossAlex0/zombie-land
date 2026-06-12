import { NextResponse } from 'next/server';
import { COOKIE_NAMES } from '@customTypes/enum/cookies';

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 8;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export const setAuthCookies = (
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string }
) => {
  response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
    ...baseOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
    ...baseOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};
