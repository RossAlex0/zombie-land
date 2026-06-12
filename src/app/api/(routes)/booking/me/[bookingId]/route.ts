import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAccessToken } from '@middleware/tokenAccess';
import { bookingController } from '@server/controllers';

export const GET = withErrorHandler(verifyAccessToken(bookingController.getMyBookingById));
//export const PATCH = withErrorHandler(verifyAccessToken(bookingController.cancelMyBooking));
