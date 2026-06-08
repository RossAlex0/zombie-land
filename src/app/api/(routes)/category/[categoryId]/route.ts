import { categoryController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';

export const GET = withErrorHandler(categoryController.readCategoryById);
