export const ROLE_NAMES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];
