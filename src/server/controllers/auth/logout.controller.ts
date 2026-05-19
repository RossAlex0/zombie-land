import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAMES } from '@server/utils/enum/cookies';
import * as authService from '@server/services/auth';

export const logout = async (req: NextRequest) => {
  try {
    const refreshToken = req.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

    if (refreshToken) {
      await authService.logout(refreshToken);
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
};
