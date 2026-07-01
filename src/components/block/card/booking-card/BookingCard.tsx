'use client';

import { useState } from 'react';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { Calendar1, Ticket, Hash, Trash2 } from 'lucide-react';
import { parseDateFr } from '@shared/date';
import './bookingCard.scss';
import { BookingStatus, BookingWithTickets } from '@customTypes/collections/booking';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import ConfirmModal from '@components/block/modal-zbl/confirm-modal/ConfirmModal';
import { fetchWithAuth } from '@shared/fetchWithAuth';
import { redirect } from 'next/navigation';
import useCreateCheckoutSession from '@hooks/api-request/checkout/useCreateCheckoutSession';

type BookingCardProps = {
  booking: BookingWithTickets;
  onCancelled?: (id: number) => void;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  [BookingStatus.CONFIRMED]: { label: 'Payée', className: 'booking_card_status_confirmed' },
  [BookingStatus.PENDING]: { label: 'En attente', className: 'booking_card_status_pending' },
  [BookingStatus.CANCELLED]: { label: 'Annulée', className: 'booking_card_status_cancelled' },
};

export default function BookingCard({ booking, onCancelled }: BookingCardProps) {
  const { createCheckoutSession } = useCreateCheckoutSession();
  const status = statusConfig[booking.status] ?? statusConfig[BookingStatus.PENDING];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetchWithAuth(`/api/booking/me/${booking.id}`, { method: 'PATCH' });
      if (!res.ok) {
        throw new Error('La réservation n’a pas pu être annulée.');
      }
      onCancelled?.(booking.id);
    } finally {
      setCancelling(false);
      setConfirmOpen(false);
    }
  };

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
            <>
              <ButtonZbl onClick={handleClickPaid} type="submit">
                Payer la réservation
              </ButtonZbl>
              <ButtonZbl
                theme="custom"
                className="btn-danger"
                navTo=""
                aria-label="Annuler la réservation"
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmOpen(true);
                }}
              >
                <Trash2 size={16} />
                <span className="btn-label">Annuler</span>
              </ButtonZbl>
            </>
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

      <ConfirmModal
        isOpen={confirmOpen}
        title="Annuler la réservation"
        message={`Annuler la réservation ${booking.reference} ? Votre réservation sera définitivement annulée.`}
        confirmLabel={cancelling ? 'Annulation…' : 'Oui, annuler'}
        cancelLabel="Retour"
        danger
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  );
}
