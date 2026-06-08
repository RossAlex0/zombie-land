import * as z from 'zod';

export const categoryCreateSchema = z.object({
  label: z.string().max(100),
});
