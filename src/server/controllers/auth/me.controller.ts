import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@prismaInstance/*';
import { COOKIE_NAMES } from '@server/utils/enum/cookies';
import { verifyAccessToken } from '@server/services/auth/token.service';

export const me = async (req: NextRequest) => {
  const token = req.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role_id: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
};
