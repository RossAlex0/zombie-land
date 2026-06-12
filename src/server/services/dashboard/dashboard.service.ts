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
   * Stats dashboard admin. Intervalle semi-ouvert [start, end[ (end = minuit du lendemain, exclu).
   * - Commercial (réservations, tickets vendus, CA) : par DATE D'ACHAT (booking.created_at),
   *   uniquement les bookings `confirmed` (payés).
   * - Occupation : par DATE DE VISITE (ticket.validity_date).
   *   entryPrice = prix d'entrée courant ; chaque ticket = 1 entrée 1 jour
   *   (createBooking génère 1 ticket / personne / jour), donc pas de × nbDays sur le CA.
   */
  async getStats(start: Date, end: Date, entryPrice: number): Promise<DashboardStats> {
    const [bookings, paidTickets, occupancyTickets] = await Promise.all([
      // Réservations confirmées achetées sur la période
      this.prisma.booking.count({
        where: { status: 'confirmed', created_at: { gte: start, lt: end } },
      }),
      // Tickets payés achetés sur la période → nb vendus + CA (réduction par catégorie)
      this.prisma.ticket.findMany({
        where: {
          status: { in: PAID_TICKET_STATUSES },
          booking: { status: 'confirmed', created_at: { gte: start, lt: end } },
        },
        select: { category: { select: { reduction: true } } },
      }),
      // Tickets occupant un créneau sur la période (par date de visite)
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
   * Occupation par jour de visite (tickets `valid`/`used`) sur [start, end[.
   * Sert au diagramme d'occupation, indépendant des règles commerciales (CA).
   * Renvoie une ligne par jour ayant au moins un ticket ; les jours vides sont comblés côté controller.
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
