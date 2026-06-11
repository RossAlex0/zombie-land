'use client';

import { DayPicker, type DateRange } from 'react-day-picker';
import { fr } from 'react-day-picker/locale';

import 'react-day-picker/style.css';
import './zombieDatePicker.scss';

type ZombieDayPickerProps = {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
};

export default function ZombieDayPicker({ selected, onSelect }: ZombieDayPickerProps) {
  return (
    <DayPicker
      mode="range"
      locale={fr}
      selected={selected}
      onSelect={onSelect}
      showOutsideDays
      className="zombie_dp"
      disabled={{ before: new Date() }}
    />
  );
}
