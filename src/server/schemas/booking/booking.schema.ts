import * as z from 'zod';

/** Nombre max de personnes pour une réservation en ligne. Au-delà : réservation de groupe via l'équipe. */
export const MAX_BOOKING_PEOPLE = 15;

export const bookingCreateSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date().optional(),
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
