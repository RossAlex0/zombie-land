import { randomBytes } from 'crypto';
import { AbstractModel } from '@server/services/AbstractModel';
import { startOfUtcDay, addUtcDays, getNbDays } from '@shared/date';

type TicketLine = { category_id: number; quantity: number };

export class BookingModel extends AbstractModel<'booking'> {
  constructor() {
    super('booking');
  }

  private generateReference() {
    return `ZBL-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  }

  /** Crée un booking + ses tickets : 1 ticket par personne et par jour. */
  async createBooking(userId: number, from: Date, to: Date, tickets: TicketLine[]) {
    const start = startOfUtcDay(from);
    const end = startOfUtcDay(to); // jour pur : end = start si réservation d'un seul jour
    const nbDays = getNbDays(start, end);
    const days = Array.from({ length: nbDays }, (_, i) => addUtcDays(from, i));

    const reference = this.generateReference();

    // reservation_number dérivé de la référence booking : ZBL-2026-XXXXXX-<jour>-<n° dans la journée>
    const ticketData = days.flatMap((day) => {
      const dayCode = day.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
      let seq = 0;
      return tickets.flatMap(({ category_id, quantity }) =>
        Array.from({ length: quantity }, () => {
          seq += 1;
          return {
            reservation_number: `${reference}-${dayCode}-${seq}`,
            status: 'pending', // devient 'valid' à la confirmation du paiement (webhook Stripe)
            validity_date: day,
            category_id,
          };
        })
      );
    });

    return this.table.create({
      data: {
        reference,
        user_id: userId,
        status: 'pending',
        start_at: start,
        end_at: end,
        duration: nbDays,
        ticket: { create: ticketData },
      },
      include: { ticket: true },
    });
  }

  getBookingsByUserId(userId: number) {
    return this.table.findMany({
      where: { user_id: userId },
      include: { ticket: { include: { category: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  getBookingById(id: number) {
    return this.table.findUnique({
      where: { id },
      include: { ticket: { include: { category: true } } },
    });
  }

  /** Annule le booking ET tous ses tickets. */
  cancel(id: number) {
    return this.table.update({
      where: { id },
      data: {
        status: 'cancelled',
        ticket: { updateMany: { where: {}, data: { status: 'cancelled' } } },
      },
    });
  }
}
