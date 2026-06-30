import * as z from 'zod';

/** Nombre max de personnes pour une réservation en ligne. Au-delà : réservation de groupe via l'équipe. */
export const MAX_BOOKING_PEOPLE = 15;

export const bookingCreateSchema = z
  .object({
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    tickets: z.array(
      z.object({
        category_id: z.number().int().positive(),
        quantity: z.number().int().min(1),
      })
    ),
  })
  .transform(({ from, to, tickets }) => ({
    from,
    to: to ?? from,
    tickets,
  }))
  .refine(({ to, from }) => to >= from, {
    message: 'La date de fin doit être postérieure à la date de début',
  })
  .refine(
    ({ tickets }) => tickets.reduce((sum, { quantity }) => sum + quantity, 0) <= MAX_BOOKING_PEOPLE,
    {
      message: `Réservation limitée à ${MAX_BOOKING_PEOPLE} personnes. Pour un groupe plus important, contactez l'équipe pour une réservation de groupe.`,
    }
  );

export const bookingSearchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'paid', 'cancelled']).optional(),
  // Filter on the visit date (start_at), inclusive range.
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sortBy: z.enum(['id', 'created_at', 'start_at', 'reference', 'total_paid']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type BookingSearchParams = z.infer<typeof bookingSearchSchema>;

export const bookingCreateForUserSchema = z
  .object({
    userId: z.number().int().positive(),
    from: z.coerce.date(),
    to: z.coerce.date().optional(),
    tickets: z.array(
      z.object({
        category_id: z.number().int().positive(),
        quantity: z.number().int().min(1),
      })
    ),
  })
  .transform(({ from, to, tickets, userId }) => ({
    userId,
    from,
    to: to ?? from,
    tickets,
  }))
  .refine(({ to, from }) => to >= from, {
    message: 'La date de fin doit être postérieure à la date de début',
  });
