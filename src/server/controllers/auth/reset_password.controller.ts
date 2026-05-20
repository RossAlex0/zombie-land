import { NextRequest, NextResponse } from 'next/server';
import * as authService from '@server/services/auth';
import { setAuthCookies } from './helpers/cookie';

export const resetPassword = async (request: NextRequest) => {
  const { email } = await request.json();

  const user = await authService.findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Password reset link sent' }, { status: 200 });
};
