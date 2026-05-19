import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'next-rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export function proxy(request: NextRequest) {
  try {
    limiter.checkNext(request, 20);
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
