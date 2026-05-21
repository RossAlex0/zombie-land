import { authController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';

// POST /api/signup
export const POST = withErrorHandler(authController.signup);
