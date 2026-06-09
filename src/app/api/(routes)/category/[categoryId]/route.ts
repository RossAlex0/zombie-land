import { categoryController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';

export const GET = withErrorHandler(categoryController.readCategoryById);

export const PATCH = withErrorHandler(categoryController.update);

export const DELETE = withErrorHandler(categoryController.delete);
