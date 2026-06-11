import { randomBytes } from 'crypto';
import { AbstractModel } from '@server/services/AbstractModel';
import { startOfUtcDay, addUtcDays, getNbDays } from '@shared/date';
import { ConfigurationModel } from '@server/services/configuration/configuration.service';
import { BadRequestError, NotFoundError } from '../../../utils/errors/errors';

type TicketLine = { category_id: number; quantity: number };

export class BookingModel extends AbstractModel<'booking'> {
  constructor() {
    super('booking');
  }

  private generateReference() {
    return `ZBL-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  }

  private round2(n: number) {
    return Math.round(n * 100) / 100;
  }

  /** Crée un booking + ses tickets : 1 ticket par personne et par jour. */
  async createBooking(userId: number, from: Date, to: Date, tickets: TicketLine[]) {
    const start = startOfUtcDay(from);
    const end = startOfUtcDay(to); // jour pur : end = start si réservation d'un seul jour -> vient du schema zod
    const now = new Date();
    if (start < now) {
      throw new BadRequestError('La date de réservation doit être dans le futur');
    }

    const nbDays = getNbDays(start, end);
    const days = Array.from({ length: nbDays }, (_, i) => addUtcDays(from, i));

    const config = await new ConfigurationModel().readSingleton();
    if (!config) {
      throw new NotFoundError('Configuration not found');
    }
    const entryPrice = Number(config.entry_price);

    const categoryIds = tickets.map((t) => t.category_id);
    const categories = await this.prisma.ticket_category.findMany({
      where: { id: { in: categoryIds } },
    });

    // tous les category_id demandés doivent exister
    if (categories.length !== new Set(categoryIds).size) {
      throw new BadRequestError('Une ou plusieurs catégories de ticket sont invalides');
    }

    const priceByCategory = new Map(
      categories.map((c) => [c.id, this.round2(entryPrice * (1 - c.reduction / 100))])
    );

    const reference = this.generateReference();

    // reservation_number dérivé de la référence booking : ZBL-2026-XXXXXX-<jour>-<n° dans la journée>
    const ticketData = days.flatMap((day) => {
      const dayCode = day.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
      let seq = 0;
      return tickets.flatMap(({ category_id, quantity }) => {
        const unit_price = priceByCategory.get(category_id);
        if (unit_price === undefined) {
          throw new NotFoundError(`Category ID ${category_id} not found in configuration`);
        }
        return Array.from({ length: quantity }, () => {
          seq += 1;
          return {
            reservation_number: `${reference}-${dayCode}-${seq}`,
            unit_price,
            status: 'pending', // devient 'valid' à la confirmation du paiement (webhook Stripe)
            validity_date: day,
            category_id,
          };
        });
      });
    });

    const subtotal = this.round2(ticketData.reduce((sum, t) => sum + t.unit_price, 0));
    const discount = 0; // pas de réduction globale pour l'instant -> pour faire evoluer
    const totalPaid = this.round2(subtotal - discount);

    return this.table.create({
      data: {
        reference,
        user_id: userId,
        status: 'pending',
        start_at: start,
        end_at: end,
        duration: nbDays,
        subtotal,
        discount,
        total_paid: totalPaid,
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
