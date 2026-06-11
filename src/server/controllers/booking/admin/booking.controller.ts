import { bookingCreateForUserSchema } from '@server/schemas';
import { BookingModel, UserModel } from '@server/services';
import { NextRequest, NextResponse } from 'next/server';
import { NotFoundError } from '../../../../utils/errors/errors';

export const adminBookingController = {
  makeBookingForUser: async (req: NextRequest) => {
    const body = await req.json();
    const { userId, from, to, tickets } = bookingCreateForUserSchema.parse(body);

    const user = await new UserModel().findUserById(userId, { id: true });
    if (!user) {
      return new NotFoundError('User not found');
    }
    const bookingService = new BookingModel();
    const booking = await bookingService.createBooking(userId, from, to, tickets);
    return NextResponse.json(booking, { status: 201 });
  },

  getAllBookings: async (req: NextRequest) => {
    const bookingService = new BookingModel();
    const bookings = await bookingService.readAll({
      include: {
        _count: {
          select: { ticket: true },
        },
      },
    });
    return NextResponse.json(bookings);
  },

  getBookingById: async (req: NextRequest, context: { params: { bookingId: string } }) => {
    const { bookingId } = context.params;
    const bookingService = new BookingModel();
    const booking = await bookingService.getBookingById(Number(bookingId));
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }
    return NextResponse.json(booking);
  },

  /*cancelBooking: async (req: NextRequest, context: { params: { bookingId: string } }) => {
    const { bookingId } = context.params;
    const bookingService = new BookingModel();
    const booking = await bookingService.cancel(Number(bookingId));
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }
    if (booking.status === 'cancelled') {
      return NextResponse.json({ message: 'Booking already cancelled' }, { status: 200 });
    }
    return NextResponse.json({ message: 'Booking cancelled' });
  },
    */
};
