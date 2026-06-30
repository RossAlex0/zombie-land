import { BookingModel } from '@server/services';
import { NextRequest, NextResponse } from 'next/server';
import { NotFoundError } from '../../../../utils/errors/errors';
import { NextContext } from '@customTypes/nextApi';
import { bookingSearchSchema } from '@server/schemas/booking/booking.schema';

export const adminBookingController = {
  getAllBookings: async (req: NextRequest) => {
    const bookingService = new BookingModel();
    const params = bookingSearchSchema.parse(Object.fromEntries(req.nextUrl.searchParams));

    const result = await bookingService.searchAndCount(params);

    return NextResponse.json(result);
  },

  getBookingById: async (_req: NextRequest, context: NextContext<{ bookingId: string }>) => {
    const { bookingId } = await context.params;
    const bookingService = new BookingModel();
    const booking = await bookingService.getBookingById(Number(bookingId));
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }
    return NextResponse.json({ data: booking });
  },

  cancelBooking: async (req: NextRequest, context: NextContext<{ bookingId: string }>) => {
    const { bookingId } = await context.params;
    const bookingService = new BookingModel();

    const booking = await bookingService.getBookingById(Number(bookingId));
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.status === 'confirmed') {
      return NextResponse.json({ message: 'Booking already paid, need refund' }, { status: 200 });
    }
    if (booking.status === 'cancelled') {
      return NextResponse.json({ message: 'Booking already cancelled' }, { status: 200 });
    }
    const cancelled = await bookingService.cancel(Number(bookingId));
    return NextResponse.json({ message: 'Booking cancelled', data: cancelled });
  },
};
