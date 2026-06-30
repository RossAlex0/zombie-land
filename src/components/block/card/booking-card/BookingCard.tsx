'use client';

import TextZbl from '@components/ui/text-zbl/TextZbl';
import { Calendar1, Ticket, Hash } from 'lucide-react';
import { parseDateFr } from '@shared/date';
import './bookingCard.scss';
import { BookingStatus, BookingWithTickets } from '@customTypes/collections/booking';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import { redirect } from 'next/navigation';
import useCreateCheckoutSession from '@hooks/api-request/checkout/useCreateCheckoutSession';

type BookingCardProps = {
  booking: BookingWithTickets;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  [BookingStatus.CONFIRMED]: { label: 'Payée', className: 'booking_card_status_confirmed' },
  [BookingStatus.PENDING]: { label: 'En attente', className: 'booking_card_status_pending' },
  [BookingStatus.CANCELLED]: { label: 'Annulée', className: 'booking_card_status_cancelled' },
};

export default function BookingCard({ booking }: BookingCardProps) {
  const { createCheckoutSession } = useCreateCheckoutSession();
  const status = statusConfig[booking.status] ?? statusConfig[BookingStatus.PENDING];

  const ticketsByCategory = booking.ticket.reduce<Record<string, number>>((acc, t) => {
    const label = t.category.label;
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});

  const handleClickPaid = async () => {
    const response = await createCheckoutSession(booking.id);
    if (response.error) {
      throw new Error(response.error);
    }

    if (response.redirect) {
      redirect(response.redirect);
    }
  };
  return (
    <article className="booking_card">
      <div className="booking_card_header">
        <div className="booking_card_header_ref">
          <Hash color="#ac382a" size={16} />
          <TextZbl jetbrains color="grey">
            {booking.reference}
          </TextZbl>
        </div>
        <div className="booking_card_header_ref">
          <span className={`booking_card_status ${status.className}`}>
            <TextZbl jetbrains>{status.label}</TextZbl>
          </span>
          {booking.status === BookingStatus.PENDING ? (
            <ButtonZbl onClick={handleClickPaid} type="submit">
              Payez la réservations
            </ButtonZbl>
          ) : undefined}
        </div>
      </div>

      <div className="booking_card_dates">
        <Calendar1 color="#ac382a" size={18} />
        <TextZbl jetbrains>
          {parseDateFr(new Date(booking.start_at))} — {parseDateFr(new Date(booking.end_at))}
        </TextZbl>
        <TextZbl jetbrains color="grey">
          ({booking.duration} jour{booking.duration > 1 ? 's' : ''})
        </TextZbl>
      </div>

      <div className="booking_card_tickets">
        <div className="booking_card_tickets_head">
          <Ticket color="#ac382a" size={18} />
          <TextZbl jetbrains color="grey" redPrefix="//">
            Survivants enregistrés
          </TextZbl>
        </div>
        <ul className="booking_card_tickets_list">
          {Object.entries(ticketsByCategory).map(([label, count]) => (
            <li key={label} className="booking_card_tickets_item">
              <TextZbl jetbrains>{label}</TextZbl>
              <TextZbl jetbrains color="grey">
                × {count}
              </TextZbl>
            </li>
          ))}
        </ul>
      </div>

      <div className="booking_card_footer">
        <TextZbl color="grey">TOTAL</TextZbl>
        <TextZbl color="yellow" tag="h3">
          {Number(booking.total_paid).toFixed(2)} €
        </TextZbl>
      </div>
    </article>
  );
}
