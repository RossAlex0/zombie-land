import { authController } from '@server/controllers';

// GET /api/auth/google/callback -> échange le code Google et connecte l'utilisateur
export const GET = authController.googleCallback;
