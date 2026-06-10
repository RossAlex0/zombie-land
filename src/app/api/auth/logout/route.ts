import { authController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';

// POST /api/logout
export const POST = withErrorHandler(authController.logout);
