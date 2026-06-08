'use client';

import TextZbl from '@components/ui/textZbl/TextZbl';
import { NotepadText } from 'lucide-react';
import ZombieDayPicker from '@components/block/zombieDatePicker/ZombieDatePicker';
import type { DateRange } from 'react-day-picker';

import './booking.scss';
import { useState } from 'react';

export default function HomeBookings() {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();

  console.info('date', selectedDate?.from, selectedDate?.to);
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
          <div className="home_booking_content_planning_title">
            <TextZbl tag="h2">RESERVATION&nbsp;</TextZbl>
            <TextZbl tag="h2" color="red">
              ZOMBIE LAND
            </TextZbl>
          </div>
          <div className="home_booking_content_planning_picker">
            <ZombieDayPicker selected={selectedDate} onSelect={setSelectedDate} />
          </div>
        </div>
        <div className="home_booking_content_ticket"></div>
      </div>
    </section>
  );
}
