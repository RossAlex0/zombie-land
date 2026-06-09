import { userController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAccessToken } from '@middleware/tokenAccess';

export const GET = withErrorHandler(verifyAccessToken(userController.listBookings));
