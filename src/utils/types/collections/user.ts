import { booking, role, user } from '@prismaInstance/*';

export type UserWithRoleAndBooking = user & { role: role; booking: booking[] };

export interface IUser {
  email: string;
  birth_date?: string;
}

export interface IUserSignup extends IUser {
  first_name: string;
  last_name: string;

  password: string;
  confirmPassword: string;
}

export interface IUserBO {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: { name: string };
  valid_email: boolean | null;
  birth_date: string | null;
  created_at: string;
}
