import { activityController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';

// GET /api/activity/:id
export const GET = withErrorHandler(activityController.readActivityById);

// PATCH /api/activity/:id
export const PATCH = withErrorHandler(activityController.update);

// DELETE /api/activity/:id
export const DELETE = withErrorHandler(activityController.delete);
