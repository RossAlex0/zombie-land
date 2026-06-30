'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarRange, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import ZombieDayPicker from '@components/block/zombie-date-picker/ZombieDatePicker';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import { parseDateWithoutTime } from '@shared/date';

import './dateRangeFilter.scss';

type DateRangeFilterProps = {
  /** Selected range as plain yyyy-MM-dd strings ('' when unset). */
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
};

// Parse a "yyyy-MM-dd" string as a local date (avoids the UTC shift of new Date(str)),
// so the calendar highlights the exact day the user picked.
function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Inline date-range filter for back-office lists: a toggle button showing the
 * active range, a clear button, and a floating calendar panel. Dates are
 * exchanged as plain yyyy-MM-dd strings so the caller can drop them straight
 * into the URL without timezone surprises.
 */
export default function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRange = useMemo<DateRange | undefined>(() => {
    if (!from && !to) return undefined;
    return {
      from: from ? parseLocalDate(from) : undefined,
      to: to ? parseLocalDate(to) : undefined,
    };
  }, [from, to]);

  const label = selectedRange
    ? `${selectedRange.from?.toLocaleDateString('fr-FR') ?? '…'} → ${selectedRange.to?.toLocaleDateString('fr-FR') ?? '…'}`
    : 'Dates de visite';

  // react-day-picker gives local Dates; serialize them as plain yyyy-MM-dd so the
  // back-office filters on the calendar day the admin sees, regardless of timezone.
  const handleSelect = (range: DateRange | undefined) => {
    onChange({
      from: range?.from ? parseDateWithoutTime(range.from) : '',
      to: range?.to ? parseDateWithoutTime(range.to) : '',
    });
  };

  const clear = () => {
    onChange({ from: '', to: '' });
    setOpen(false);
  };

  // Close the panel when clicking outside of it.
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  return (
    <div className="bo-date-filter" ref={containerRef}>
      <ButtonZbl theme="light" navTo="" onClick={() => setOpen((isOpen) => !isOpen)}>
        <CalendarRange size={16} />
        <span className="btn-label">{label}</span>
      </ButtonZbl>
      {selectedRange && (
        <ButtonZbl theme="light" navTo="" onClick={clear} aria-label="Effacer le filtre de dates">
          <X size={16} />
        </ButtonZbl>
      )}
      {open && (
        <div className="bo-date-filter_panel">
          <ZombieDayPicker allowPast selected={selectedRange} onSelect={handleSelect} />
        </div>
      )}
    </div>
  );
}
