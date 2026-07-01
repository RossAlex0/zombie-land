import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'next-rate-limit';
import jwt from 'jsonwebtoken';
import { isAdmin } from '@middleware/verifyAdmin';
import { COOKIE_NAMES } from '@customTypes/enum/cookies';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

type JwtPayload = {
  userId: string;
  role: number;
};

export async function proxy(request: NextRequest) {
  try {
    limiter.checkNext(request, 20);
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  if (request.nextUrl.pathname.includes('/admin/back-office')) {
    const token = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const userIsAdmin = await isAdmin(payload.role);

      if (!userIsAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/back-office'],
};
