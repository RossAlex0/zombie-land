import { authController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';

// POST /api/login
export const POST = withErrorHandler(authController.login);
