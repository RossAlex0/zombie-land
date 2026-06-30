'use client';

import ModalZbl from '../ModalZbl';
import { BookingWithTickets } from '@customTypes/collections/booking';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import './finalBooking.scss';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { parseDateFr } from '@shared/date';

type FinalBookingModalProps = {
  booking: BookingWithTickets;
  onValidate: () => void;
  onClose: () => void;
};
export default function FinalBookingModal({
  booking,
  onValidate,
  onClose,
}: FinalBookingModalProps) {
  return (
    <ModalZbl onClose={onClose}>
      <div className="booking_modal">
        <TextZbl tag="h2" className="booking_modal_title">
          Passez au paiement
        </TextZbl>
        <TextZbl redPrefix="//" color="grey" jetbrains>
          Réservation
          {booking.start_at === booking.end_at
            ? ` pour le ${parseDateFr(booking.start_at)}`
            : ` du ${parseDateFr(booking.start_at)} au ${parseDateFr(booking.end_at)}`}
        </TextZbl>
        <TextZbl redPrefix="//" color="grey" jetbrains>
          Prix : {Number(booking.total_paid)} €
        </TextZbl>
        <TextZbl redPrefix="//" color="grey" jetbrains>
          Nombre de ticket : {booking.ticket.length} <i>(1 ticket par jour et par personne)</i>
        </TextZbl>
      </div>
      <div className="booking_modal_btn">
        <ButtonZbl onClick={onClose} theme="dark" type="submit">
          <TextZbl color="yellow">Retour</TextZbl>
        </ButtonZbl>
        <ButtonZbl onClick={onValidate} type="submit">
          <TextZbl color="black">Passer au paiement</TextZbl>
        </ButtonZbl>
      </div>
    </ModalZbl>
  );
}
