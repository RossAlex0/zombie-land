import { authController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErorrHandler';

// POST /api/signup
export const POST = withErrorHandler(authController.signup);
