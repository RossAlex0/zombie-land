import { z } from 'zod';

export const updateConfigurationSchema = z
  .object({
    entry_price: z
      .number()
      .nonnegative('Le prix doit être positif')
      .multipleOf(0.01, 'Maximum 2 décimales'),

    capacity: z
      .number()
      .int('La capacité doit être un entier')
      .positive('La capacité doit être supérieure à 0'),

    status: z
      .string()
      .max(50, 'Statut trop long')
      .refine((s) => ['active', 'inactive', 'maintenance'].includes(s), {
        message: 'Statut invalide',
      }),
    opening_hours: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Format horaire invalide (HH:MM)'),

    closing_hours: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Format horaire invalide (HH:MM)'),
  })
  .partial()
  .refine(
    (data) => {
      if (data.opening_hours && data.closing_hours) {
        return data.opening_hours < data.closing_hours;
      }
      return true;
    },
    {
      message: "L'heure d'ouverture doit être avant l'heure de fermeture",
      path: ['closing_hours'],
    }
  );
