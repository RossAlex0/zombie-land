import { BookingModel } from '@server/services';
import { NextRequest, NextResponse } from 'next/server';
import { NotFoundError } from '../../../../utils/errors/errors';

export const adminBookingController = {
  getAllBookings: async (_req: NextRequest) => {
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
