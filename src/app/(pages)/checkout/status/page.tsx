'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Hash, Calendar1, Ticket } from 'lucide-react';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import useFetch from '@hooks/api-request/useFetch';
import { BookingStatus, BookingWithTickets } from '@customTypes/collections/booking';
import { parseDateFr } from '@shared/date';
import './checkoutStatus.scss';

const orderStatusLabel: Record<string, string> = {
  [BookingStatus.CONFIRMED]: 'Commande confirmée',
  [BookingStatus.PENDING]: 'En attente de paiement',
  [BookingStatus.CANCELLED]: 'Commande annulée',
};

function CheckoutStatusContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('status') === 'success';
  const bookingId = searchParams.get('booking_id');

  const { data: bookings, loading } = useFetch<BookingWithTickets[]>('/api/booking/me', true);
  const booking = bookings?.find((b) => String(b.id) === bookingId);

  return (
    <section className="checkout_status">
      <div
        className={`checkout_status_card checkout_status_card--${isSuccess ? 'success' : 'cancel'}`}
      >
        <div className="checkout_status_icon">
          {isSuccess ? (
            <CheckCircle2 color="#2ed525" size={64} strokeWidth={1.5} />
          ) : (
            <XCircle color="#ac382a" size={64} strokeWidth={1.5} />
          )}
        </div>

        <TextZbl tag="h1" color={isSuccess ? 'yellow' : 'red'}>
          {isSuccess ? 'Paiement réussi' : 'Paiement annulé'}
        </TextZbl>

        <TextZbl jetbrains color="grey" redPrefix="//">
          {isSuccess
            ? 'Votre accès à la zone infectée est confirmé.'
            : "La transaction n'a pas été finalisée."}
        </TextZbl>

        {loading ? (
          <span className="checkout_status_spinner" role="status" aria-label="Loading" />
        ) : booking ? (
          <div className="checkout_status_info">
            <div className="checkout_status_info_row">
              <span className="checkout_status_info_row_label">
                <Hash color="#ac382a" size={16} />
                <TextZbl jetbrains color="grey">
                  Référence
                </TextZbl>
              </span>
              <TextZbl jetbrains>{booking.reference}</TextZbl>
            </div>

            <div className="checkout_status_info_row">
              <span className="checkout_status_info_row_label">
                <Calendar1 color="#ac382a" size={16} />
                <TextZbl jetbrains color="grey">
                  Dates
                </TextZbl>
              </span>
              <TextZbl jetbrains>
                {parseDateFr(new Date(booking.start_at))} — {parseDateFr(new Date(booking.end_at))}
              </TextZbl>
            </div>

            <div className="checkout_status_info_row">
              <span className="checkout_status_info_row_label">
                <Ticket color="#ac382a" size={16} />
                <TextZbl jetbrains color="grey">
                  Survivants
                </TextZbl>
              </span>
              <TextZbl jetbrains>{booking.ticket.length}</TextZbl>
            </div>

            <div className="checkout_status_info_row">
              <span className="checkout_status_info_row_label">
                <TextZbl jetbrains color="grey">
                  Statut
                </TextZbl>
              </span>
              <span className={`checkout_status_badge checkout_status_badge--${booking.status}`}>
                <TextZbl jetbrains>{orderStatusLabel[booking.status] ?? booking.status}</TextZbl>
              </span>
            </div>

            <div className="checkout_status_prices">
              {Number(booking.discount) > 0 && (
                <>
                  <div className="checkout_status_prices_row">
                    <TextZbl color="grey" jetbrains>
                      Sous-total
                    </TextZbl>
                    <TextZbl jetbrains>{Number(booking.subtotal).toFixed(2)} €</TextZbl>
                  </div>
                  <div className="checkout_status_prices_row checkout_status_prices_row--discount">
                    <TextZbl color="grey" jetbrains>
                      Réduction
                    </TextZbl>
                    <TextZbl jetbrains>-{Number(booking.discount).toFixed(2)} €</TextZbl>
                  </div>
                </>
              )}
              <div className="checkout_status_prices_total">
                <TextZbl color="grey" jetbrains>
                  {Number(booking.discount) > 0 ? 'Total payé' : 'Total'}
                </TextZbl>
                <TextZbl color="yellow" tag="h3" jetbrains>
                  {Number(booking.total_paid).toFixed(2)} €
                </TextZbl>
              </div>
            </div>
          </div>
        ) : undefined}

        <div className="checkout_status_actions">
          <ButtonZbl theme="dark" navTo="/booking/me">
            <TextZbl color="yellow">Voir mes réservations</TextZbl>
          </ButtonZbl>
          <ButtonZbl theme="dark" navTo="/">
            <TextZbl color="yellow">Retour à l&apos;accueil</TextZbl>
          </ButtonZbl>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutStatusPage() {
  return (
    <Suspense>
      <CheckoutStatusContent />
    </Suspense>
  );
}
