import { userController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAccessToken } from '@middleware/tokenAccess';

export const PATCH = withErrorHandler(verifyAccessToken(userController.updatePassword));
