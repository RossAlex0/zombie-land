import { ticket, ticket_category } from '@prismaInstance/*';
import stripe from 'stripe';

export function ticketToStripeLineItems(
  tickets: (ticket & { category: ticket_category })[]
): stripe.Checkout.SessionCreateParams.LineItem[] {
  const grouped = tickets.reduce(
    (acc, ticket) => {
      const cat = ticket.category.label;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ticket);
      return acc;
    },
    {} as Record<string, (ticket & { category: ticket_category })[]>
  );

  return Object.values(grouped).map((ticketsGrouped) => ({
    quantity: ticketsGrouped.length,
    price_data: {
      currency: 'eur',
      product_data: {
        name: `Tickets ${ticketsGrouped[0].category.label}`,
      },
      unit_amount: Math.round(Number(ticketsGrouped[0].unit_price) * 100),
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
    throw new Error(`FRONT_URL invalid : ${FRONT_URL}`);
  }

  const sessionParameters: stripe.Checkout.SessionCreateParams = {
    line_items: items,
    mode: 'payment',
    success_url: `${FRONT_URL}/checkout/status?status=success&booking_id=${bookingId}`,
    cancel_url: `${FRONT_URL}/checkout/status?status=cancel&booking_id=${bookingId}`,
    automatic_tax: { enabled: true },
    allow_promotion_codes: true,
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
