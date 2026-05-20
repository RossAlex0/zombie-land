import { NextRequest, NextResponse } from 'next/server';
import * as authService from '@server/services/auth';
import { setAuthCookies } from './helpers/cookie';

export const login = async (request: NextRequest) => {
  const { email, password } = await request.json();

  const result = await authService.loginUser(email, password);

  if (!result.ok) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });

  setAuthCookies(response, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  return response;
};
