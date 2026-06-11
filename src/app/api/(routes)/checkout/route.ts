import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAccessToken } from '@middleware/tokenAccess';
import { checkoutController } from '@server/controllers/checkout/checkout.controller';

// export const POST = withErrorHandler(verifyAccessToken(checkoutController.createBookingAndCheckoutSession));
export const POST = checkoutController.createBookingAndCheckoutSession;
