import stripe from 'stripe';

export async function getCheckoutSessionURL(
  items: stripe.Checkout.SessionCreateParams.LineItem[],
  bookingId: number,
  stripe_customer_id?: string | null
) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('no secret Stripe API KEY');
  const stripeClient = new stripe(key);
  const FRONT_URL = process.env.FRONT_URL;
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
  if (stripe_customer_id) sessionParameters.customer = stripe_customer_id;
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
