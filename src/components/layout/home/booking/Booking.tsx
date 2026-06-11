'use client';

import TextZbl from '@components/ui/text-zbl/TextZbl';
import { Calendar1, Minus, NotepadText, Plus, TicketMinus, Users } from 'lucide-react';
import ZombieDayPicker from '@components/block/zombie-date-picker/ZombieDatePicker';
import type { DateRange } from 'react-day-picker';
import { useMemo, useState } from 'react';
import { getNbDays, parseDateFr } from '@shared/date';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import { configuration } from '@prismaInstance/*';

import './booking.scss';

type HomeBookingsProps = {
  config: configuration;
};

export default function HomeBookings({ config }: HomeBookingsProps) {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);

  const isRemovePeopleDisabled = useMemo(() => numberOfPeople <= 1, [numberOfPeople]);

  const addPeople = () => setNumberOfPeople(numberOfPeople + 1);

  const removePeople = () => {
    if (!isRemovePeopleDisabled) {
      setNumberOfPeople(numberOfPeople - 1);
    }
  };

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
          <div className="home_booking_content_ticket_info">
            <div className="home_booking_content_ticket_info_details">
              <Calendar1 color="#ac382a" size={20} />
              <TextZbl color="grey" jetbrains>
                Date :
              </TextZbl>
              <TextZbl jetbrains>
                {selectedDate?.from ? parseDateFr(selectedDate.from) : ''} au&nbsp; <br />
                {selectedDate?.to ? parseDateFr(selectedDate.to) : ''}
              </TextZbl>
            </div>
            <div className="home_booking_content_ticket_info_details">
              <Users color="#ac382a" size={20} />
              <TextZbl color="grey" jetbrains>
                Personnes :
              </TextZbl>
              <TextZbl jetbrains>{numberOfPeople}</TextZbl>
              <div className="home_booking_content_ticket_info_details_btns">
                <button
                  className={`${isRemovePeopleDisabled ? 'details_btn_disabled' : 'details_btn'} btn_left`}
                  disabled={isRemovePeopleDisabled}
                  onClick={removePeople}
                >
                  <Minus color="#e5e5e5" size={16} />
                </button>
                <button className="details_btn btn_right" onClick={addPeople}>
                  <Plus color="#e5e5e5" size={16} />
                </button>
              </div>
            </div>
            <div className="home_booking_content_ticket_info_details">
              <TicketMinus color="#ac382a" size={20} />
              <TextZbl color="grey" jetbrains>
                Prix du billet :
              </TextZbl>
              <TextZbl jetbrains>{String(config?.entry_price) ?? '-'} €</TextZbl>
            </div>
          </div>
          <div className="home_booking_content_validation">
            <div className="home_booking_content_validation_price">
              <TextZbl color="grey">TOTAL</TextZbl>
              <TextZbl color="yellow" tag="h3">
                {selectedDate?.from && selectedDate?.to
                  ? `${numberOfPeople * (Number(config?.entry_price) * getNbDays(selectedDate.from, selectedDate.to))} €`
                  : ''}
              </TextZbl>
            </div>
            <div className="home_booking_content_validation_btn">
              <ButtonZbl>
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
