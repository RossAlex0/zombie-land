import { randomBytes } from 'crypto';
import { bookingWhereInput } from '../../../../prisma/generated/models';
import { AbstractModel } from '@server/services/AbstractModel';
import { startOfUtcDay, endOfUtcDay, addUtcDays, getNbDays } from '@shared/date';
import { ConfigurationModel } from '@server/services/configuration/configuration.service';
import { BadRequestError, NotFoundError } from '../../../utils/errors/errors';
import { BookingStatus } from '@customTypes/collections/booking';
import type { BookingSearchParams } from '@server/schemas/booking/booking.schema';

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

  async createBooking(userId: number, from: string, to: string, tickets: TicketLine[]) {
    const start = new Date(`${from}T00:00:00.000Z`); // 2026-06-14T00:00:00Z -> stocké "2026-06-14"
    const end = new Date(`${to}T00:00:00.000Z`);

    const now = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
    if (start < now) {
      throw new BadRequestError('Booking date must be in the future');
    }

    const nbDays = getNbDays(start, end);
    const days = Array.from({ length: nbDays }, (_, i) => addUtcDays(start, i)); // start, pas from

    const config = await new ConfigurationModel().readSingleton();
    if (!config) {
      throw new NotFoundError('Configuration not found');
    }
    const entryPrice = Number(config.entry_price);

    const categoryIds = tickets.map((t) => t.category_id);
    const categories = await this.prisma.ticket_category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (categories.length !== new Set(categoryIds).size) {
      throw new BadRequestError('Une ou plusieurs catégories de ticket sont invalides');
    }

    const priceByCategory = new Map(
      categories.map((c) => [c.id, this.round2(entryPrice * (1 - c.reduction / 100))])
    );

    const reference = this.generateReference();

    const ticketData = days.flatMap((day) => {
      const dayCode = day.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD, en UTC -> juste
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
            status: 'pending',
            validity_date: day,
            category_id,
          };
        });
      });
    });

    const subtotal = this.round2(ticketData.reduce((sum, t) => sum + t.unit_price, 0));
    const discount = 0;
    const totalPaid = this.round2(subtotal - discount);

    return this.table.create({
      data: {
        reference,
        user_id: userId,
        status: BookingStatus.PENDING,
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

  /** Paginated list of bookings for the back-office (search by reference + status filter). */
  async searchAndCount(params: BookingSearchParams) {
    const where: bookingWhereInput = {};

    if (params.search) {
      where.reference = { contains: params.search, mode: 'insensitive' };
    }

    if (params.status) {
      where.status = params.status;
    }

    // Filter on the visit date (start_at), inclusive on both bounds.
    if (params.dateFrom || params.dateTo) {
      where.start_at = {
        ...(params.dateFrom && { gte: startOfUtcDay(params.dateFrom) }),
        ...(params.dateTo && { lte: endOfUtcDay(params.dateTo) }),
      };
    }

    const [data, total] = await Promise.all([
      this.table.findMany({
        where,
        include: { _count: { select: { ticket: true } } },
        orderBy: { [params.sortBy]: params.sortOrder },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.table.count({ where }),
    ]);

    return { data, total, page: params.page, limit: params.limit };
  }

  getBookingsByUserId(userId: number) {
    return this.table.findMany({
      where: { user_id: userId, end_at: { gte: new Date() } },
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
        status: BookingStatus.CANCELLED,
        ticket: { updateMany: { where: {}, data: { status: 'cancelled' } } },
      },
    });
  }
}
