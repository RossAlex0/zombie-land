'use client';

import { useState } from 'react';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import Loading from '../../../loading';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import './bookingMe.scss';
import { BookingStatus, BookingWithTickets } from '@customTypes/collections/booking';
import BookingCard from '@components/block/card/booking-card/BookingCard';

export default function MyBookingsPage() {
  const { data, loading, error } = useFetch<BookingWithTickets[]>('/api/booking/me');
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());

  if (loading) return <Loading />;

  if (error) {
    throw new Error('Erreur durant la récupération de vos réservations ( /booking/me )');
  }

  // A booking cancelled by the user disappears from the list right away.
  const handleCancelled = (id: number) => {
    setRemovedIds((prev) => new Set(prev).add(id));
    clearCache('/api/booking/me');
  };

  // Declutter: hide cancelled bookings (server-side) and the ones just cancelled (local).
  const visibleBookings = (data ?? []).filter(
    (booking) => booking.status !== BookingStatus.CANCELLED && !removedIds.has(booking.id)
  );

  return (
    <section className="bookings_me">
      <div className="bookings_me_header">
        <div className="bookings_me_header_title">
          <TextZbl tag="h1">MES</TextZbl>
          <TextZbl tag="h1" color="red">
            &nbsp;RÉSERVATIONS
          </TextZbl>
        </div>
        <TextZbl jetbrains color="grey" redPrefix="//">
          <span>registre des accès</span>
        </TextZbl>
      </div>

      {visibleBookings.length > 0 ? (
        <div className="bookings_me_list">
          {visibleBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancelled={handleCancelled} />
          ))}
        </div>
      ) : (
        <div className="bookings_me_empty">
          <TextZbl jetbrains color="grey">
            Aucun accès enregistré. La zone vous attend.
          </TextZbl>
          <ButtonZbl theme="dark" navTo="/booking">
            <TextZbl color="yellow">Réserver une entrée</TextZbl>
          </ButtonZbl>
        </div>
      )}
    </section>
  );
}
