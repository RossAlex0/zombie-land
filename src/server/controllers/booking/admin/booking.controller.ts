import { randomBytes } from 'crypto';
import { bookingCreateForUserSchema } from '@server/schemas';
import { BookingModel } from '@server/services';
import { startOfUtcDay, addUtcDays, getNbDays } from '@shared/date';
import { NextRequest, NextResponse } from 'next/server';

const generateBookingReference = () =>
  `ZBL-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;

export const adminBookingController = {
  makeBookingForUser: async (req: NextRequest) => {
    const body = await req.json();
    const { userId, from, to, tickets } = bookingCreateForUserSchema.parse(body);

    const bookingService = new BookingModel();
    const booking = await bookingService.createBooking(userId, from, to, tickets);
    return NextResponse.json(booking, { status: 201 });
  },

  getAllBookings: async (req: NextRequest) => {
    const bookingService = new BookingModel();
    const bookings = await bookingService.readAll({
      include: {
        ticket: true,
      },
    });
    return NextResponse.json(bookings);
  },

  getBookingById: async (req: NextRequest, context: { params: { bookingId: string } }) => {
    const { bookingId } = context.params;
    const bookingService = new BookingModel();
    const booking = await bookingService.getBookingById(Number(bookingId));
    return NextResponse.json(booking);
  },

  cancelBooking: async (req: NextRequest, context: { params: { bookingId: string } }) => {
    const { bookingId } = context.params;
    const bookingService = new BookingModel();
    await bookingService.cancel(Number(bookingId));
    return NextResponse.json({ message: 'Booking cancelled' });
  },
};
