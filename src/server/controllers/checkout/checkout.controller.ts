import { NextRequest, NextResponse } from 'next/server';
// import { NotFoundError } from '../../../../utils/errors/errors';
import { getCheckoutSessionURL, ticketToStripeLineItems } from '../../../utils/stripe/stripe';
import { getTokenAccess } from '../../../utils/api/token';
import { bookingCreateSchema } from '@server/schemas';
import { BookingModel, UserModel } from '@server/services';

export const checkoutController = {
  createBookingAndCheckoutSession: async (req: NextRequest) => {
    // const token = getTokenAccess(req)
    // console.log(token)
    const userId = 1;
    const body = await req.json();
    const { from, to, tickets } = bookingCreateSchema.parse(body);
    const bookingService = new BookingModel();
    const booking = await bookingService.createBooking(userId, from, to, tickets);
    const userService = new UserModel();
    const user = await userService.findUserById(userId, { id: true, stripe_customer_id: true });
    const line_items = ticketToStripeLineItems(booking.ticket);
    const session = await getCheckoutSessionURL(line_items, booking.id, user?.stripe_customer_id);
    console.log(session.url);
    return NextResponse.json({ checkoutURL: session.url });
  },
};
