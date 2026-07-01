import { bookingCreateSchema } from '@server/schemas';
import { BookingModel } from '@server/services';

import { getTokenAccess } from '../../../utils/api/token';
import { signTicketToken } from '../../../utils/api/ticketToken';
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

    return NextResponse.json({ data: booking }, { status: 201 });
  },

  getMyBookings: async (req: NextRequest) => {
    const token = getTokenAccess(req);
    const bookingService = new BookingModel();
    const bookings = await bookingService.getBookingsByUserId(token.userId);
    return NextResponse.json({ data: bookings }, { status: 200 });
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

  getMyBookingBillets: async (req: NextRequest, context: NextContext<{ bookingId: string }>) => {
    const token = getTokenAccess(req);
    const { bookingId } = await context.params;
    const bookingService = new BookingModel();
    const booking = await bookingService.getBookingById(Number(bookingId));
    if (!booking || booking.user_id !== token.userId) {
      throw new NotFoundError('Booking not found');
    }
    // One billet per valid (paid) ticket; pending/cancelled tickets get none.
    const billets = booking.ticket
      .filter((t) => t.status === 'valid')
      .map((t) => ({
        id: t.id,
        reservation_number: t.reservation_number,
        category_label: t.category.label,
        validity_date: t.validity_date,
        qr_token: signTicketToken({
          tid: t.id,
          rn: t.reservation_number,
          vd: new Date(t.validity_date).toISOString().slice(0, 10),
        }),
      }));
    return NextResponse.json(
      {
        data: {
          reference: booking.reference,
          start_at: booking.start_at,
          end_at: booking.end_at,
          billets,
        },
      },
      { status: 200 }
    );
  },

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
    if (booking[0].status === 'confirmed') {
      return NextResponse.json(
        { message: 'You cannot cancel a booking already paid' },
        { status: 200 }
      );
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
};
