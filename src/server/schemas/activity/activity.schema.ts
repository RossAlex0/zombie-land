import * as z from 'zod';

export const activityCreateSchema = z.object({
  name: z.string().max(100),
  description: z.string().optional(),
  status: z.string().max(255).default('open'),
  picture: z.url().max(255).optional(),
  category_activity: z
    .array(
      z.object({
        category_id: z.number().int().positive(),
      })
    )
    .optional(),
});

export const activityUpdateSchema = activityCreateSchema.partial();
