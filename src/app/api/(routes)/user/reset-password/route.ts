import { authController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErorrHandler';

// POST /api/user/reset-password
export const POST = withErrorHandler(authController.resetPassword);
