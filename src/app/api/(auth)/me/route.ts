import { NextRequest } from 'next/server';
import * as authController from '@server/controllers/auth';

export async function GET(req: NextRequest) {
  return authController.me(req);
}
