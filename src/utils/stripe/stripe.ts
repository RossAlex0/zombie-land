import { Decimal } from '@prisma/client/runtime/client';
import stripe from 'stripe';

//type prisma à récupérer et utiliser
type BookingTicket = {
  id: number;
  reservation_number: string;
  category_id: number;
  unit_price: Decimal;
  validity_date: Date;
  booking_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export function ticketToStripeLineItems(
  tickets: BookingTicket[]
): stripe.Checkout.SessionCreateParams.LineItem[] {
  return tickets.map((ticket) => ({
    quantity: 1,
    price_data: {
      currency: 'eur',
      product_data: {
        name: `Ticket #${ticket.id}`,
      },
      unit_amount: Math.round(Number(ticket.unit_price) * 100),
    },
  }));
}

export async function getCheckoutSessionURL(
  items: stripe.Checkout.SessionCreateParams.LineItem[],
  bookingId: number,
  stripe_customer_id?: string | null
) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('no secret Stripe API KEY');
  const stripeClient = new stripe(key);
  const FRONT_URL = process.env.FRONT_URL;

  if (!FRONT_URL?.startsWith('http')) {
    throw new Error(`FRONT_URL invalide : ${FRONT_URL}`);
  }

  const sessionParameters: stripe.Checkout.SessionCreateParams = {
    line_items: items,
    mode: 'payment',
    success_url: `${FRONT_URL}/checkout/success`,
    cancel_url: `${FRONT_URL}/checkout/cancel`,
    automatic_tax: { enabled: true },
    metadata: {
      booking_id: bookingId,
    },
  };
  if (stripe_customer_id) {
    sessionParameters.customer = stripe_customer_id;
  } else {
    sessionParameters.customer_creation = 'always';
  }
  const session = await stripeClient.checkout.sessions.create(sessionParameters);
  return session;
}

export async function startStripeCustomerPortalSession(
  stripeCustomerId: string,
  return_url: string
) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('no secret Stripe API KEY');
  const stripeClient = new stripe(key);
  const customerPortalSession = await stripeClient.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: return_url,
  });
  return customerPortalSession;
}
