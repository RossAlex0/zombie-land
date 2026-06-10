import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAdmin } from '@middleware/verifyAdmin';
import { adminBookingController } from '@server/controllers';

export const POST = withErrorHandler(verifyAdmin(adminBookingController.makeBookingForUser));
