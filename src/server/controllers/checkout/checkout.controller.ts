import { NextRequest, NextResponse } from 'next/server';
// import { NotFoundError } from '../../../../utils/errors/errors';
import { getCheckoutSessionURL, ticketToStripeLineItems } from '../../../utils/stripe/stripe';
import { getTokenAccess } from '../../../utils/api/token';
import { BookingModel, UserModel } from '@server/services';
import { BadRequestError, NotFoundError } from '@errors/errors';

// {
//   "from": "2026-07-15T00:00:00.000Z",
//   "to": "2026-07-15T00:00:00.000Z",
//   "tickets": [
//     {
//       "category_id": 1,
//       "quantity": 2
//     },
//     {
//       "category_id": 2,
//       "quantity": 2
//     }
//   ]
// }

export const checkoutController = {
  createBookingAndCheckoutSession: async (req: NextRequest) => {
    const token = getTokenAccess(req);
    // Recuperer booking id via body et user id via token
    const userId = token.userId;
    const body = await req.json();

    const bookingId = body?.bookingId as number | undefined;

    if (!bookingId) {
      throw new BadRequestError('No booking id in payload.');
    }
    // const { from, to, tickets } = bookingCreateSchema.parse(body);
    const bookingService = new BookingModel();

    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      throw new NotFoundError(`Booking[${bookingId}] not found.`);
    }
    // const booking = await bookingService.createBooking(userId, from, to, tickets);
    const userService = new UserModel();
    const user = await userService.findUserById(userId, { id: true, stripe_customer_id: true });
    const line_items = ticketToStripeLineItems(booking.ticket);
    const session = await getCheckoutSessionURL(line_items, bookingId, user?.stripe_customer_id);
    console.log(session.url);
    return NextResponse.json({ checkoutURL: session.url });
  },
};
