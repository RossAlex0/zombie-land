import jwt from 'jsonwebtoken';

// Dedicated secret for ticket QR tokens; falls back to JWT_SECRET so prod needs no extra config.
const secret = (process.env.TICKET_SECRET ?? process.env.JWT_SECRET) as string;

// Compact payload to keep the QR code dense-but-scannable.
export type TicketTokenPayload = {
  tid: number; // ticket id
  rn: string; // reservation_number
  vd: string; // validity day, YYYY-MM-DD
};

/** Signs a ticket into a tamper-proof token to embed in its QR code. */
export const signTicketToken = (payload: TicketTokenPayload): string => {
  return jwt.sign(payload, secret, { algorithm: 'HS256' });
};

/** Verifies a scanned QR token and returns its payload (throws if forged/altered). */
export const verifyTicketToken = (token: string): TicketTokenPayload => {
  return jwt.verify(token, secret) as TicketTokenPayload;
};
