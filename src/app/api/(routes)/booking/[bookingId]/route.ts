import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAdmin } from '@middleware/verifyAdmin';
import { adminBookingController } from '@server/controllers/booking/admin/booking.controller';

export const GET = withErrorHandler(verifyAdmin(adminBookingController.getBookingById));
export const DELETE = withErrorHandler(verifyAdmin(adminBookingController.cancelBooking));
