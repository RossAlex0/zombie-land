import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAccessToken } from '@middleware/tokenAccess';
import { bookingController } from '@server/controllers';

export const POST = withErrorHandler(verifyAccessToken(bookingController.makeBooking));
export const GET = withErrorHandler(verifyAccessToken(bookingController.getMyBookings));
