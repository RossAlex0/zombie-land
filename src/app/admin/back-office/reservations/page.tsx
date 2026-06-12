'use client';

import { Eye } from 'lucide-react';
import DataTable, { Column } from '@components/block/data-table/DataTable';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import StatusBadge, { BadgeStatus } from '@components/ui/status-badge/StatusBadge';
import FlashMessage from '@components/ui/flash-message/FlashMessage';
import useFetch from '@hooks/api-request/useFetch';
import '../backoffice.scss';

type BookingRow = {
  [key: string]: unknown;
  id: number;
  reference: string;
  status: string;
  start_at: string;
  end_at: string;
  total_paid: string;
  _count: { ticket: number };
};

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
      `${new Date(row.start_at as string).toLocaleDateString('fr-FR')} → ${new Date(row.end_at as string).toLocaleDateString('fr-FR')}`,
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

export default function ReservationsPage() {
  const { data, loading, error } = useFetch<BookingRow[]>('/api/booking');

  const bookings = data ?? [];

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Réservations</TextZbl>
          </div>
          <div className="backoffice_content_header_title_items yellow">
            <TextZbl jetbrains color="yellow">
              {bookings.length} réservations
            </TextZbl>
          </div>
        </div>
      </div>

      <FlashMessage />

      {loading && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}

      {!loading && !error && (
        <DataTable<BookingRow>
          columns={columns}
          data={bookings}
          searchable
          searchKeys={['reference', 'status']}
          emptyMessage="Aucune réservation trouvée"
          renderActions={(row) => (
            <ButtonZbl theme="light" navTo={`/admin/back-office/reservations/${row.id}`}>
              <Eye size={16} />
              <span className="btn-label">Voir</span>
            </ButtonZbl>
          )}
        />
      )}
    </div>
  );
}
