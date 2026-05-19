import { NextRequest } from 'next/server';
import * as authController from '@server/controllers/auth/logout.controller';

export async function POST(req: NextRequest) {
  return authController.logout(req);
}
