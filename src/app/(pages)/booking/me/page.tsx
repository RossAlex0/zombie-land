'use client';

import useFetch from '@hooks/api-request/useFetch';
import Loading from '../../../loading';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import './bookingMe.scss';
import { BookingWithTickets } from '@customTypes/collections/booking';
import BookingCard from '@components/block/card/booking-card/BookingCard';

export default function MyBookingsPage() {
  const { data: bookings, loading, error } = useFetch<BookingWithTickets[]>('/api/booking/me');

  if (loading) return <Loading />;

  if (error) {
    throw new Error('Erreur durant la récupération de vos réservations ( /booking/me )');
  }

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

      {bookings && bookings.length > 0 ? (
        <div className="bookings_me_list">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
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
