import { withErrorHandler } from '@helpers/withErrorHandler';
import { activityController } from '@server/controllers';

// GET /api/activity
export const GET = withErrorHandler(activityController.readAllActivities);

// POST /api/activity
export const POST = withErrorHandler(activityController.create);
