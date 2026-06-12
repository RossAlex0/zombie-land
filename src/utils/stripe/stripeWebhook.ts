import { prisma } from '@prismaInstance/*';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function stripeWebhook(req: NextRequest) {
  try {
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

        //récupère le stripe_customer_id fourni par stripe sous forme de string (stripe peut renvoyer un object dans certains cas)
        let customerId: string | null = null;
        if (typeof session.customer === 'string') {
          customerId = session.customer;
        } else if (session.customer?.id) {
          customerId = session.customer.id;
        }
        const bookingIdRaw = session.metadata?.booking_id;

        if (!bookingIdRaw) {
          console.error('Missing bookingId');
          break;
        }

        const bookingId = Number(bookingIdRaw);

        const updatedBooking = await prisma.booking.update({
          where: {
            id: bookingId,
            status: 'pending',
          },
          data: {
            status: 'paid',
          },
        });

        const booking = await prisma.booking.findFirst({
          where: { id: bookingId },
        });

        if (booking?.user_id && customerId) {
          await prisma.user.updateMany({
            where: {
              id: booking.user_id,
              stripe_customer_id: null,
            },
            data: {
              stripe_customer_id: customerId,
            },
          });
        }

        console.log('Booking paid:', bookingId);
        break;
      }

      default:
        console.log(`Unhandled event ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('WEBHOOK ERROR', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
