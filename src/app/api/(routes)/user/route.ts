import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAdmin } from '@middleware/verifyAdmin';
import { adminUserController } from '@server/controllers/user/admin/user.controller';

export const GET = withErrorHandler(verifyAdmin(adminUserController.readAllUsers));
