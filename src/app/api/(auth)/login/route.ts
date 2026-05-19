import { NextRequest } from 'next/server';
import * as authController from '@server/controllers/auth';

export async function POST(req: NextRequest) {
  return authController.login(req);
}
