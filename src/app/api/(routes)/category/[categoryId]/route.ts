import { categoryController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAdmin } from '@middleware/verifyAdmin';

export const GET = withErrorHandler(categoryController.readCategoryById);

export const PATCH = withErrorHandler(verifyAdmin(categoryController.update));

export const DELETE = withErrorHandler(verifyAdmin(categoryController.delete));
