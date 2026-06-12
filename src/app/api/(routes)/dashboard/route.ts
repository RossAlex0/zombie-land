import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAdmin } from '@middleware/verifyAdmin';
import { dashboardController } from '@server/controllers/dashboard/dashboard.controller';

// GET /api/dashboard?period=today|last-week|last-month  (admin uniquement)
export const GET = withErrorHandler(verifyAdmin(dashboardController.getStats));
