import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAdmin } from '@middleware/verifyAdmin';
import { categoryController } from '@server/controllers';

export const GET = withErrorHandler(categoryController.readAllCategories);

export const POST = withErrorHandler(verifyAdmin(categoryController.create));
