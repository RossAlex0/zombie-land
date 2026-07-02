import { authController } from '@server/controllers';

// GET /api/auth/google -> redirige vers l'écran de consentement Google
export const GET = authController.googleRedirect;
