import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'next-rate-limit';
// import jwt from 'jsonwebtoken';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

// type JwtPayload = {
//   userId: string;
//   role: { name: 'user' | 'admin' };
// };

export function proxy(request: NextRequest) {
  try {
    limiter.checkNext(request, 20);
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // if (request.nextUrl.pathname.startsWith('/admin')) {
  //   const token = request.cookies.get('token')?.value;

  //   if (!token) {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }

  //   try {
  //     const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  //     if (payload.role.name !== 'admin') {
  //       return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  //     }
  //   } catch {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};
