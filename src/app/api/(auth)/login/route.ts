import { authController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErorrHandler';

// POST /api/login
export const POST = withErrorHandler(authController.login);
