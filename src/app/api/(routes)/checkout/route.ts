import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutSessionURL } from '../../../../utils/stripe/stripe';

type Booking = {
  id: number;
  tickets: Ticket[];
};

type Ticket = {
  id: number;
  ticketType: 'FULL' | 'REDUCED';
  price_modifyer: number;
  amount: number;
};

export async function POST(req: NextRequest) {
  const { bookingId } = await req.json();
  //! et/ou envoyer les line-items en body
  const lineItems = [];
  const session = await getCheckoutSessionURL(lineItems, bookingId, stripe_customer_id);
  return NextResponse.json({ checkoutURL: session.url });
}
