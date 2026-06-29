import { AbstractModel } from '@server/services/AbstractModel';

export type DashboardStats = {
  bookings: number;
  ticketsSold: number;
  revenue: number;
  occupancyTickets: number;
};

const PAID_TICKET_STATUSES = ['valid', 'used']; // a completer avec stripe

export class DashboardModel extends AbstractModel<'booking'> {
  constructor() {
    super('booking');
  }

  /**
   * Admin dashboard stats. Semi-open interval (start to end, with end = midnight of next day, excluded).
   * - Commercial (bookings, tickets sold, revenue) : by PURCHASE DATE (booking.created_at), only `confirmed` bookings (paid).
   * - Occupancy : by VISIT DATE (ticket.validity_date).
   *   entryPrice = current entry price ; each ticket = 1 entry 1 day
   *   (createBooking generates 1 ticket / person / day), therefore no × nbDays on the revenue.
   * -
   */
  async getStats(start: Date, end: Date, entryPrice: number): Promise<DashboardStats> {
    const [bookings, paidTickets, occupancyTickets] = await Promise.all([
      // Confirmed booking in the period
      this.prisma.booking.count({
        where: { status: 'confirmed', created_at: { gte: start, lt: end } },
      }),
      // Tickets payés achetés sur la période → nb vendus + CA (réduction par catégorie)
      // Paid ticket buy within the period + nb sold + TR (total revenue minus category reduction)
      this.prisma.ticket.findMany({
        where: {
          status: { in: PAID_TICKET_STATUSES },
          booking: { status: 'confirmed', created_at: { gte: start, lt: end } },
        },
        select: { category: { select: { reduction: true } } },
      }),
      // Tickets with validity during the period (by visit date)
      this.prisma.ticket.count({
        where: {
          status: { in: PAID_TICKET_STATUSES },
          validity_date: { gte: start, lt: end },
        },
      }),
    ]);

    const revenue = paidTickets.reduce(
      (sum, t) => sum + entryPrice * (1 - t.category.reduction / 100),
      0
    );

    return {
      bookings,
      ticketsSold: paidTickets.length,
      revenue: Math.round(revenue * 100) / 100,
      occupancyTickets,
    };
  }

  /**
   *
   * Occupancy by visit day (tickets `valid`/`used`) over [start, end[.
   * Used for the occupancy chart, independent of commercial rules (revenue).
   * Returns one line per day with at least one ticket; empty days are filled on the controller side.
   */
  getDailyOccupancy(start: Date, end: Date) {
    return this.prisma.ticket.groupBy({
      by: ['validity_date'],
      where: {
        status: { in: PAID_TICKET_STATUSES },
        validity_date: { gte: start, lt: end },
      },
      _count: { _all: true },
      orderBy: { validity_date: 'asc' },
    });
  }
}
