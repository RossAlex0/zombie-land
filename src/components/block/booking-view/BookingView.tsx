'use client';

import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { BookingStatus } from '@customTypes/collections/booking';
import useFetch from '@hooks/api-request/useFetch';
import { booking } from '@prismaInstance/*';
import './bookingView.scss';

export default function BookingView() {
  const {
    data: booking,
    loading: loadingBooking,
    error: errorBooking,
  } = useFetch<booking[]>('/api/booking/me');

  if (errorBooking) {
    throw new Error('Failed to load your bookings. Please try again later.');
  }

  if (loadingBooking) {
    return (
      <div className="booking_history booking_history--loading">
        <span className="booking_history_spinner" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="booking_history">
      <div className="booking_history_container">
        <TextZbl redPrefix="//" color="grey">
          Mes réservations:
        </TextZbl>
        <TextZbl tag="h3" jetbrains color="yellow">
          {booking?.filter((b) => b.status === 'confirmed').length ?? 0}
        </TextZbl>
      </div>
      <div className="booking_history_container">
        <TextZbl redPrefix="//" color="grey">
          Mes réservations en attentes de paiement:
        </TextZbl>
        <TextZbl tag="h3" jetbrains color="yellow">
          {booking?.filter((b) => b.status === BookingStatus.PENDING).length ?? 0}
        </TextZbl>
      </div>
      <div className="booking_history_container">
        <TextZbl redPrefix="//" color="grey">
          Mes réservations passé:
        </TextZbl>
        <TextZbl tag="h3" jetbrains color="yellow">
          {booking?.filter(
            (b) => new Date(b.start_at) < new Date() || b.status === BookingStatus.CANCELLED
          ).length ?? 0}
        </TextZbl>
      </div>
      <div className="booking_history_btn">
        <ButtonZbl navTo="/booking/me">Voir mes réservations</ButtonZbl>
      </div>
    </div>
  );
}
