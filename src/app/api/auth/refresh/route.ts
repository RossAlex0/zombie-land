import { authController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';

// POST /api/auth/refresh
export const POST = withErrorHandler(authController.refresh);
