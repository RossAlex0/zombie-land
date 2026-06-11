import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function stripeWebhook(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
  }

  const stripe = new Stripe(key);

  const payload = await req.text();

  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed', error);

    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(session.id);
      const customerId = session.customer;
      //add stripe_customer_id in DB
      console.log(customerId);
      if (session.metadata) {
        const bookingId = session.metadata.bookingId ? session.metadata.bookingId : null;
        //passer la réservation de pending à "paid" ?
        console.log(bookingId);
      }

      break;
    }
    case 'payment_intent.payment_failed':
      console.log('payment_failed');
      console.log(event.data.object);
      break;

    default:
      console.log(`Unhandled event ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
