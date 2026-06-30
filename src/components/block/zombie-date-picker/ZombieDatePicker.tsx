'use client';

import { DayPicker, type DateRange } from 'react-day-picker';
import { fr } from 'react-day-picker/locale';

import 'react-day-picker/style.css';
import './zombieDatePicker.scss';

type ZombieDayPickerProps = {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  /**
   * Allow selecting past dates. Off by default, so the public booking flow can
   * never book in the past. Only the back-office (read-only filtering) opts in.
   */
  allowPast?: boolean;
};

export default function ZombieDayPicker({ selected, onSelect, allowPast }: ZombieDayPickerProps) {
  return (
    <DayPicker
      mode="range"
      locale={fr}
      selected={selected}
      onSelect={onSelect}
      showOutsideDays
      className="zombie_dp"
      disabled={allowPast ? undefined : { before: new Date() }}
    />
  );
}
