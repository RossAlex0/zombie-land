import { activityController } from '@server/controllers';
import { withErrorHandler } from '@helpers/withErrorHandler';

// GET /api/activity/:id
export const GET = withErrorHandler(activityController.readActivityById);
