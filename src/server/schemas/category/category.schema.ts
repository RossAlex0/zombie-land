import * as z from 'zod';

export const categoryCreateSchema = z.object({
  label: z.string().max(100),
});

export const categoryUpdateSchema = z.object({
  label: z.string().max(100),
});
