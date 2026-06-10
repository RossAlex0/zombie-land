import * as z from 'zod';

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
  });

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
