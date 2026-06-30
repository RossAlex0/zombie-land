'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarRange, Eye, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import DataTable, { Column } from '@components/block/data-table/DataTable';
import ZombieDayPicker from '@components/block/zombie-date-picker/ZombieDatePicker';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import DropDownZbl from '@components/ui/drop-down-zbl/DropDownZbl';
import SearchInput from '@components/ui/input/search-input/SearchInput';
import StatusBadge, { BadgeStatus } from '@components/ui/status-badge/StatusBadge';
import FlashMessage from '@components/ui/flash-message/FlashMessage';
import { useBookingSearch } from '@hooks/api-request/booking/useBookingSearch';
import { parseDateWithoutTime } from '@shared/date';
import type { IBookingBO } from '@customTypes/collections/booking';
import '../backoffice.scss';

type BookingRow = IBookingBO & { [key: string]: unknown };

const columns: Column<BookingRow>[] = [
  { key: 'reference', label: 'Référence' },
  {
    key: 'status',
    label: 'Statut',
    render: (value) => <StatusBadge status={value as BadgeStatus} />,
  },
  {
    key: 'start_at',
    label: 'Dates',
    render: (_, row) =>
      `${new Date(row.start_at).toLocaleDateString('fr-FR')} → ${new Date(row.end_at).toLocaleDateString('fr-FR')}`,
  },
  {
    key: '_count',
    label: 'Tickets',
    render: (value) => String((value as { ticket: number }).ticket),
  },
  {
    key: 'total_paid',
    label: 'Total payé',
    render: (value) => `${parseFloat(String(value)).toFixed(2)} €`,
  },
];

const statusOptions = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'pending' },
  { label: 'Payée', value: 'paid' },
  { label: 'Annulée', value: 'cancelled' },
];

const LIMIT = 20;

// Parse a "yyyy-MM-dd" string as a local date (avoids the UTC shift of new Date(str)),
// so the calendar highlights the exact day the user picked.
function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function ReservationsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The URL is the source of truth: search, status, dates and page survive navigation.
  const urlSearch = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const dateFrom = searchParams.get('dateFrom') ?? '';
  const dateTo = searchParams.get('dateTo') ?? '';
  const page = Number(searchParams.get('page') ?? 1);

  // Local state only for typing: the input reacts immediately,
  // the URL is updated after the debounce.
  const [inputSearch, setInputSearch] = useState(urlSearch);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Rebuild the calendar selection from the URL (visit-date range filter).
  const selectedRange = useMemo<DateRange | undefined>(() => {
    if (!dateFrom && !dateTo) return undefined;
    return {
      from: dateFrom ? parseLocalDate(dateFrom) : undefined,
      to: dateTo ? parseLocalDate(dateTo) : undefined,
    };
  }, [dateFrom, dateTo]);

  const dateLabel = selectedRange
    ? `${selectedRange.from?.toLocaleDateString('fr-FR') ?? '…'} → ${selectedRange.to?.toLocaleDateString('fr-FR') ?? '…'}`
    : 'Dates de visite';

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      // Any filter change resets to page 1
      if (!('page' in updates)) params.delete('page');
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (inputSearch === urlSearch) return;
    const timer = setTimeout(() => updateParams({ search: inputSearch }), 300);
    return () => clearTimeout(timer);
  }, [inputSearch, urlSearch, updateParams]);

  // react-day-picker gives local Dates; serialize them as plain yyyy-MM-dd so the
  // back-office filters on the calendar day the admin sees, regardless of timezone.
  const handleDateSelect = (range: DateRange | undefined) => {
    updateParams({
      dateFrom: range?.from ? parseDateWithoutTime(range.from) : '',
      dateTo: range?.to ? parseDateWithoutTime(range.to) : '',
    });
  };

  const clearDates = () => {
    updateParams({ dateFrom: '', dateTo: '' });
    setDatePickerOpen(false);
  };

  const query = new URLSearchParams();
  if (urlSearch) query.set('search', urlSearch);
  if (status) query.set('status', status);
  if (dateFrom) query.set('dateFrom', dateFrom);
  if (dateTo) query.set('dateTo', dateTo);
  query.set('page', String(page));
  query.set('limit', String(LIMIT));

  const { bookings, total, limit, initialLoading, error } = useBookingSearch(query.toString());

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Réservations</TextZbl>
          </div>
          <div className="backoffice_content_header_title_items yellow">
            <TextZbl jetbrains color="yellow">
              {total} réservations
            </TextZbl>
          </div>
        </div>
        <DropDownZbl
          options={statusOptions}
          value={status}
          onChange={(opt) => updateParams({ status: opt.value })}
        />
      </div>

      <FlashMessage />

      {initialLoading && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}

      {!error && (
        <>
          <div className="bo-filters">
            <SearchInput
              value={inputSearch}
              onChange={setInputSearch}
              placeholder="Rechercher une réservation..."
            />
            <div className="bo-date-filter">
              <ButtonZbl theme="light" navTo="" onClick={() => setDatePickerOpen((open) => !open)}>
                <CalendarRange size={16} />
                <span className="btn-label">{dateLabel}</span>
              </ButtonZbl>
              {selectedRange && (
                <ButtonZbl
                  theme="light"
                  navTo=""
                  onClick={clearDates}
                  aria-label="Effacer le filtre de dates"
                >
                  <X size={16} />
                </ButtonZbl>
              )}
              {datePickerOpen && (
                <div className="bo-date-filter_panel">
                  <ZombieDayPicker allowPast selected={selectedRange} onSelect={handleDateSelect} />
                </div>
              )}
            </div>
          </div>
          <DataTable<BookingRow>
            columns={columns}
            data={bookings as BookingRow[]}
            emptyMessage="Aucune réservation trouvée"
            total={total}
            page={page}
            limit={limit}
            onPageChange={(p) => updateParams({ page: String(p) })}
            renderActions={(row) => (
              <ButtonZbl theme="light" navTo={`/admin/back-office/reservations/${row.id}`}>
                <Eye size={16} />
                <span className="btn-label">Voir</span>
              </ButtonZbl>
            )}
          />
        </>
      )}
    </div>
  );
}

// useSearchParams requires a Suspense boundary (same pattern as the users page)
export default function ReservationsPage() {
  return (
    <Suspense>
      <ReservationsPageInner />
    </Suspense>
  );
}
