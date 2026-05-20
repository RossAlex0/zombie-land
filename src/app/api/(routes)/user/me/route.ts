import { userController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErorrHandler';
import { verifyAccessToken } from '@middleware/tokenAcces';

// POST /api/user/me
export const GET = withErrorHandler(verifyAccessToken(userController.me));
