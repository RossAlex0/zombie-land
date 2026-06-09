import { activityController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAdmin } from '@middleware/verifyAdmin';

// GET /api/activity/:id
export const GET = withErrorHandler(activityController.readActivityById);

// PATCH /api/activity/:id
export const PATCH = withErrorHandler(verifyAdmin(activityController.update));

// DELETE /api/activity/:id
export const DELETE = withErrorHandler(verifyAdmin(activityController.delete));
