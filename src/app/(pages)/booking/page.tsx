'use client';

import ZombieDayPicker from '@components/block/zombie-date-picker/ZombieDatePicker';
import useFetch from '@hooks/api-request/useFetch';
import Loading from '../../loading';
import TicketCategoryCard from '@components/block/card/ticket-category/TicketCategoryCard';
import { configuration, ticket_category } from '@prismaInstance/*';
import { useMemo, useState } from 'react';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import TicketSummary from '@components/block/ticket-summary/TicketSummary';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import { getNbDays } from '@shared/date';
import './booking.scss';
import { useBooking } from '@context/bookingProvider';
import useCreateBooking from '@hooks/api-request/booking/useCreateBooking';
import FinalBookingModal from '@components/block/modal-zbl/final-booking/FinaleBookingModal';
import { BookingWithTickets } from '@customTypes/collections/booking';
import useCreateCheckoutSession from '@hooks/api-request/checkout/useCreateCheckoutSession';
import { redirect } from 'next/navigation';
import { useAuth } from '@context/authProvider';
import BookingView from '@components/block/booking-view/BookingView';

export default function BookingPage() {
  const { createBooking } = useCreateBooking();
  const { createCheckoutSession } = useCreateCheckoutSession();
  const { user } = useAuth();

  const {
    data: ticketCat,
    loading: loadingTicketCat,
    error: errorTicketCat,
  } = useFetch<ticket_category[]>('/api/ticket-category');

  const {
    data: config,
    loading: loadingConfig,
    error: errorConfig,
  } = useFetch<configuration>('/api/configuration');

  const [openModal, setOpenModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingWithTickets | undefined>();

  const { selectedDate, setSelectedDate, quantities, setQuantities } = useBooking();

  const numberOfPeople = useMemo(
    () => Object.values(quantities).reduce((sum, qty) => sum + qty, 0),
    [quantities]
  );

  const total = useMemo(() => {
    if (!selectedDate?.from || !selectedDate?.to || !ticketCat || !config) return 0;

    const nbDays = getNbDays(selectedDate.from, selectedDate.to);
    const basePrice = Number(config.entry_price);

    const pricePerStay = ticketCat.reduce((sum, t) => {
      const qty = quantities[t.id] ?? 0;
      const unitPrice = basePrice * (1 - t.reduction / 100);
      return sum + unitPrice * qty;
    }, 0);

    return pricePerStay * nbDays;
  }, [quantities, selectedDate, ticketCat, config]);

  const handleQuantityChange = (categoryId: number, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [categoryId]: quantity }));
  };

  if (loadingTicketCat || loadingConfig) {
    return <Loading />;
  }
  if (errorTicketCat || errorConfig) {
    throw new Error('Error while synchronizing booking page data.');
  }

  const canConfirm = numberOfPeople > 0 && !!selectedDate?.from && !!selectedDate?.to;

  const handleSubmitBooking = async () => {
    if (canConfirm) {
      const tickets = Object.entries(quantities)
        .filter(([, quantity]) => quantity > 0)
        .map(([categoryId, quantity]) => ({
          category_id: Number(categoryId),
          quantity,
        }));

      const response = await createBooking({
        from: selectedDate.from!,
        to: selectedDate.to!,
        tickets: tickets,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.ok && response.data) {
        setCurrentBooking(response.data);
        setOpenModal(true);
      }
    }
  };

  const handleClickPaid = async () => {
    if (currentBooking) {
      const response = await createCheckoutSession(currentBooking.id);
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.redirect) {
        redirect(response.redirect);
      }
    }
  };

  return (
    <section className="booking">
      <div className="booking_container">
        <div className="booking_container_left">
          <div className="booking_container_left_picker">
            <div className="booking_container_row">
              <TextZbl tag="h2" className="booking_container_row_title title_responsive">
                Réservez votre séjour de survie à&nbsp;
              </TextZbl>
              <TextZbl color="red" tag="h2" className="booking_container_row_title ">
                Zombie land
              </TextZbl>
            </div>
            <ZombieDayPicker selected={selectedDate} onSelect={setSelectedDate} />
          </div>
          <div className="booking_container_left_ticket">
            {ticketCat?.map((t) => (
              <TicketCategoryCard
                key={t.id}
                label={t.label}
                basePrice={Number(config?.entry_price ?? 20)}
                reduction={t.reduction}
                quantity={quantities[t.id] ?? 0}
                onChange={(qty) => handleQuantityChange(t.id, qty)}
              />
            ))}
          </div>
        </div>
        <div className="booking_container_right">
          <div className="booking_container_row">
            <TextZbl tag="h2" className="booking_container_row_title">
              Résumé de l&apos;excursion
            </TextZbl>
          </div>
          <TicketSummary
            selectedDate={selectedDate}
            numberOfPeople={numberOfPeople}
            entryPrice={Number(config?.entry_price ?? 0)}
          />
          <div className="booking_container_validation">
            <div className="booking_container_validation_price">
              <TextZbl color="grey">TOTAL</TextZbl>
              <TextZbl color="yellow" tag="h3">
                {total > 0 ? `${total.toFixed(2)} €` : ''}
              </TextZbl>
            </div>
            <div className="booking_container_validation_btn">
              {user ? (
                <ButtonZbl disabled={!canConfirm} onClick={handleSubmitBooking} type="submit">
                  <TextZbl color="black">Confirmer</TextZbl>
                </ButtonZbl>
              ) : (
                <div className="booking_container_validation_login">
                  <TextZbl color="yellow" jetbrains>
                    Connectez-vous pour réserver votre séjour.
                  </TextZbl>
                  <ButtonZbl navTo="/auth/login" theme="light">
                    <TextZbl color="black">Se connecter</TextZbl>
                  </ButtonZbl>
                </div>
              )}
            </div>
            <div className="booking_container_validation_desc">
              <TextZbl color="grey">
                LA DIRECTION DÉCLINE TOUTE RESPONSABILITÉ EN CAS DE MORSURE, CONTAMINATION OU
                DISPARITION.
                <br />
                LA LIMITE D&apos;AGE LEGALE EST DE 12 ANS.
              </TextZbl>
            </div>
          </div>
        </div>
      </div>
      {user ? <BookingView /> : undefined}
      {openModal && currentBooking ? (
        <FinalBookingModal
          onClose={() => setOpenModal(false)}
          onValidate={handleClickPaid}
          booking={currentBooking}
        />
      ) : undefined}
    </section>
  );
}
