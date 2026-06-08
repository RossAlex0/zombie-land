import { ROLE_NAMES } from '@customTypes/enum/roles';
import { z } from 'zod';

export const updateRoleSchema = z.object({
  role: z.enum(Object.values(ROLE_NAMES)),
});

export const userSearchSchema = z.object({
  search: z.string().optional(),
  role: z.enum(Object.values(ROLE_NAMES)).optional(),
  valid_email: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  sortBy: z.enum(['id', 'created_at', 'first_name', 'last_name', 'email']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type UserSearchParams = z.infer<typeof userSearchSchema>;
