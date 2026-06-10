import { booking, role, user } from '@prismaInstance/*';

export type UserWithRoleAndBooking = user & { role: role; booking: booking[] };
