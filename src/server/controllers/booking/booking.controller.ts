import { bookingCreateSchema } from '@server/schemas';
import { BookingModel } from '@server/services';

import { getTokenAccess } from '../../../utils/api/token';
import { NextRequest, NextResponse } from 'next/server';
import { NotFoundError } from '../../../utils/errors/errors';
import { NextContext } from '@customTypes/nextApi';

export const bookingController = {
  makeBooking: async (req: NextRequest) => {
    const token = getTokenAccess(req);
    const body = await req.json();
    const { from, to, tickets } = bookingCreateSchema.parse(body);

    const bookingService = new BookingModel();
    const booking = await bookingService.createBooking(token.userId, from, to, tickets);

    return NextResponse.json(booking, { status: 201 });
  },

  getMyBookings: async (req: NextRequest) => {
    const token = getTokenAccess(req);
    const bookingService = new BookingModel();
    const bookings = await bookingService.getBookingsByUserId(token.userId);
    return NextResponse.json(bookings, { status: 200 });
  },

  getMyBookingById: async (req: NextRequest, context: NextContext<{ bookingId: string }>) => {
    const token = getTokenAccess(req);
    const { bookingId } = await context.params;
    const bookingService = new BookingModel();
    const booking = await bookingService.getBookingById(Number(bookingId));
    if (!booking || booking.user_id !== token.userId) {
      throw new NotFoundError('Booking not found');
    }
    return NextResponse.json(booking, { status: 200 });
  },

  /*
  cancelMyBooking: async (req: NextRequest, context: NextContext<{ bookingId: string }>) => {
    const token = getTokenAccess(req);
    const { bookingId } = await context.params;

    const bookingService = new BookingModel();
    const booking = await bookingService.readAll({
      where: {
        id: parseInt(bookingId),
        user_id: token.userId,
      },
    });

    if (!booking.length) {
      throw new NotFoundError('Booking not found');
    }

    if (booking[0].status === 'cancelled') {
      return NextResponse.json({ message: 'Booking already cancelled' }, { status: 200 });
    }

    if (token.userId !== booking[0].user_id) {
      throw new NotFoundError('Booking not found');
    }

    await bookingService.cancel(parseInt(bookingId));

    return NextResponse.json({ message: 'Booking cancelled' }, { status: 200 });
  },
  */
};
