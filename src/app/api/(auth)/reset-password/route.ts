import { authController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';

// POST /api/user/reset-password
export const POST = withErrorHandler(authController.resetPassword);
