import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAdmin } from '@middleware/verifyAdmin';
import { adminUserController } from '@server/controllers/user/admin/user.controller';

export const GET = withErrorHandler(verifyAdmin(adminUserController.getUserById));
export const PATCH = withErrorHandler(verifyAdmin(adminUserController.updateRole));
export const DELETE = withErrorHandler(verifyAdmin(adminUserController.deleteUser));
