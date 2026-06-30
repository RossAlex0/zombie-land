'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye } from 'lucide-react';
import DataTable, { Column } from '@components/block/data-table/DataTable';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import DropDownZbl from '@components/ui/drop-down-zbl/DropDownZbl';
import SearchInput from '@components/ui/input/search-input/SearchInput';
import StatusBadge, { BadgeStatus } from '@components/ui/status-badge/StatusBadge';
import FlashMessage from '@components/ui/flash-message/FlashMessage';
import { useBookingSearch } from '@hooks/api-request/booking/useBookingSearch';
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

function ReservationsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The URL is the source of truth: search, status and page survive navigation.
  const urlSearch = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const page = Number(searchParams.get('page') ?? 1);

  // Local state only for typing: the input reacts immediately,
  // the URL is updated after the debounce.
  const [inputSearch, setInputSearch] = useState(urlSearch);

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

  const query = new URLSearchParams();
  if (urlSearch) query.set('search', urlSearch);
  if (status) query.set('status', status);
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
          <SearchInput
            value={inputSearch}
            onChange={setInputSearch}
            placeholder="Rechercher une réservation..."
          />
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
