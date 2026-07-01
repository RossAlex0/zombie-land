import { BookingStatus } from '@customTypes/collections/booking';
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
        // get the stripe_customer_id from stripe in string (stripe can sometimes return an object)
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

        if (session.payment_status === 'paid') {
          let promoCode: string | null = null;
          if (session.discounts && session.discounts.length > 0) {
            const discount = session.discounts[0];
            if (typeof discount.promotion_code === 'string') {
              const promotionCode = await stripe.promotionCodes.retrieve(discount.promotion_code);
              promoCode = promotionCode.code;
            } else if (discount.promotion_code?.code) {
              promoCode = discount.promotion_code.code;
            }
          }

          const subtotal = session.amount_subtotal ? session.amount_subtotal / 100 : 0;
          const total = session.amount_total ? session.amount_total / 100 : 0;
          const discountAmount = subtotal - total;

          await prisma.$transaction([
            prisma.booking.updateMany({
              where: { id: bookingId, status: BookingStatus.PENDING },
              data: {
                status: BookingStatus.CONFIRMED,
                subtotal: subtotal,
                total_paid: total,
                discount: discountAmount,
                ...(promoCode && { promo_code: promoCode }),
              },
            }),
            prisma.ticket.updateMany({
              where: { booking_id: bookingId },
              data: { status: 'valid' },
            }),
          ]);
        }

        const booking = await prisma.booking.findFirst({
          where: { id: bookingId },
          select: { user_id: true },
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
