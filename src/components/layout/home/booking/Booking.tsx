'use client';

import TextZbl from '@components/ui/text-zbl/TextZbl';
import { NotepadText } from 'lucide-react';
import ZombieDayPicker from '@components/block/zombie-date-picker/ZombieDatePicker';
import { useMemo } from 'react';
import { getNbDays } from '@shared/date';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import { configuration } from '@prismaInstance/*';
import TicketSummary from '@components/block/ticket-summary/TicketSummary';
import { useBooking } from '@context/bookingProvider';
import './booking.scss';

type HomeBookingsProps = {
  config: configuration;
};

const DEFAULT_CATEGORY_ID = 1; // Adult

export default function HomeBookings({ config }: HomeBookingsProps) {
  const { selectedDate, setSelectedDate, quantities, setQuantities } = useBooking();

  const numberOfPeople = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const isRemovePeopleDisabled = useMemo(() => numberOfPeople <= 1, [numberOfPeople]);

  const addPeople = () => {
    setQuantities((prev) => ({
      ...prev,
      [DEFAULT_CATEGORY_ID]: (prev[DEFAULT_CATEGORY_ID] ?? 0) + 1,
    }));
  };

  const removePeople = () => {
    if (!isRemovePeopleDisabled) {
      setQuantities((prev) => ({
        ...prev,
        [DEFAULT_CATEGORY_ID]: Math.max(0, (prev[DEFAULT_CATEGORY_ID] ?? 0) - 1),
      }));
    }
  };

  const total = useMemo(() => {
    if (!selectedDate?.from || !selectedDate?.to) return 0;
    const nbDays = getNbDays(selectedDate.from, selectedDate.to);
    return numberOfPeople * Number(config?.entry_price) * nbDays;
  }, [numberOfPeople, selectedDate, config]);

  return (
    <section className="home_booking">
      <div className="home_booking_text">
        <TextZbl jetbrains color="red">
          <NotepadText size={16} />
          <span>Section_003 - reservation d’accès</span>
        </TextZbl>
        <span className="home_booking_text_title" style={{ marginBottom: '-1rem' }}>
          <TextZbl tag="h2">PLANIFIER VOTRE</TextZbl>
          <TextZbl tag="h2" color="red">
            &nbsp;PROCHAINE&nbsp;
          </TextZbl>
          <TextZbl tag="h2">SORTIE</TextZbl>
        </span>
      </div>
      <div className="home_booking_content">
        <div className="home_booking_content_planning">
          <div className="home_booking_content_title">
            <TextZbl tag="h2">RESERVATION&nbsp;</TextZbl>
            <TextZbl tag="h2" color="red">
              ZOMBIE LAND
            </TextZbl>
          </div>
          <div className="home_booking_content_planning_picker">
            <ZombieDayPicker selected={selectedDate} onSelect={setSelectedDate} />
          </div>
        </div>
        <div className="home_booking_content_ticket">
          <div className="home_booking_content_title">
            <TextZbl tag="h2">TICKET</TextZbl>
          </div>
          <TicketSummary
            selectedDate={selectedDate}
            numberOfPeople={numberOfPeople}
            entryPrice={Number(config?.entry_price ?? 0)}
            onAddPeople={addPeople}
            onRemovePeople={removePeople}
            isRemoveDisabled={isRemovePeopleDisabled}
          />
          <div className="home_booking_content_validation">
            <div className="home_booking_content_validation_price">
              <TextZbl color="grey">TOTAL</TextZbl>
              <TextZbl color="yellow" tag="h3">
                {total > 0 ? `${total.toFixed(2)} €` : ''}
              </TextZbl>
            </div>
            <div className="home_booking_content_validation_btn">
              <ButtonZbl navTo="/booking">
                <TextZbl color="black">Confirmer</TextZbl>
              </ButtonZbl>
            </div>
            <div className="home_booking_content_validation_desc">
              <TextZbl color="grey">
                LA DIRECTION DÉCLINE TOUTE RESPONSABILITÉ EN CAS DE MORSURE, CONTAMINATION OU
                DISPARITION.
              </TextZbl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
