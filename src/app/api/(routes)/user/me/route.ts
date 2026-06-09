import { userController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAccessToken } from '@middleware/tokenAccess';

export const GET = withErrorHandler(verifyAccessToken(userController.me));
export const PUT = withErrorHandler(verifyAccessToken(userController.updateMe));
export const PATCH = withErrorHandler(verifyAccessToken(userController.updatePassword));
export const DELETE = withErrorHandler(verifyAccessToken(userController.deleteMe));
