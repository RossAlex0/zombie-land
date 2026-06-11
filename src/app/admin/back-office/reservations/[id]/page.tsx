'use client';

import { useParams } from 'next/navigation';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import StatusBadge, { BadgeStatus } from '@components/ui/status-badge/StatusBadge';
import DataTable, { Column } from '@components/block/data-table/DataTable';
import useFetch from '@hooks/api-request/useFetch';
import '../../backoffice.scss';
import './reservation-detail.scss';

type TicketRow = {
  [key: string]: unknown;
  id: number;
  reservation_number: string;
  category_label: string;
  reduction: string;
  unit_price: string;
  validity_date: string;
  status: string;
};

type BookingDetail = {
  id: number;
  reference: string;
  status: string;
  start_at: string;
  end_at: string;
  duration: number;
  subtotal: string;
  discount: string;
  total_paid: string;
  promo_code: string | null;
  ticket: {
    id: number;
    reservation_number: string;
    unit_price: string;
    status: string;
    validity_date: string;
    category: { label: string; reduction: number };
  }[];
};

const ticketColumns: Column<TicketRow>[] = [
  { key: 'reservation_number', label: 'N° réservation', truncate: true },
  { key: 'category_label', label: 'Catégorie' },
  { key: 'reduction', label: 'Réduction' },
  { key: 'unit_price', label: 'Prix unitaire' },
  { key: 'validity_date', label: 'Validité' },
  {
    key: 'status',
    label: 'Statut',
    render: (value) => <StatusBadge status={value as BadgeStatus} />,
  },
];

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: booking, loading, error } = useFetch<BookingDetail>(`/api/admin/booking/${id}`);

  const ticketRows: TicketRow[] =
    booking?.ticket.map((t) => ({
      id: t.id,
      reservation_number: t.reservation_number,
      category_label: t.category.label,
      reduction: `${t.category.reduction} %`,
      unit_price: `${parseFloat(String(t.unit_price)).toFixed(2)} €`,
      validity_date: new Date(t.validity_date).toLocaleDateString('fr-FR'),
      status: t.status,
    })) ?? [];

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Réservation</TextZbl>
          </div>
          {booking && (
            <div className="backoffice_content_header_title_items yellow">
              <TextZbl jetbrains color="yellow">
                {booking.reference}
              </TextZbl>
            </div>
          )}
        </div>
      </div>

      {loading && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}

      {booking && (
        <div className="reservation-detail">
          <div className="reservation-detail__info">
            <div className="bo-value">
              <TextZbl jetbrains>Référence</TextZbl>
              <TextZbl jetbrains className="bo-value__content">
                {booking.reference}
              </TextZbl>
            </div>
            <div className="bo-value">
              <TextZbl jetbrains>Statut</TextZbl>
              <div>
                <StatusBadge status={booking.status as BadgeStatus} />
              </div>
            </div>
            <div className="bo-value">
              <TextZbl jetbrains>Date de début</TextZbl>
              <TextZbl jetbrains className="bo-value__content">
                {new Date(booking.start_at).toLocaleDateString('fr-FR')}
              </TextZbl>
            </div>
            <div className="bo-value">
              <TextZbl jetbrains>Date de fin</TextZbl>
              <TextZbl jetbrains className="bo-value__content">
                {new Date(booking.end_at).toLocaleDateString('fr-FR')}
              </TextZbl>
            </div>
            <div className="bo-value">
              <TextZbl jetbrains>Durée</TextZbl>
              <TextZbl jetbrains className="bo-value__content">
                {booking.duration} {booking.duration > 1 ? 'jours' : 'jour'}
              </TextZbl>
            </div>
            {parseFloat(String(booking.discount)) > 0 && (
              <div className="bo-value">
                <TextZbl jetbrains>Remise</TextZbl>
                <TextZbl jetbrains className="bo-value__content">
                  {parseFloat(String(booking.discount)).toFixed(2)} €
                </TextZbl>
              </div>
            )}
            <div className="bo-value">
              <TextZbl jetbrains>Total payé</TextZbl>
              <TextZbl jetbrains className="bo-value__content">
                {parseFloat(String(booking.total_paid)).toFixed(2)} €
              </TextZbl>
            </div>
          </div>

          <div className="reservation-detail__tickets">
            <TextZbl jetbrains className="reservation-detail__section-title">
              Tickets ({booking.ticket.length})
            </TextZbl>
            <DataTable<TicketRow>
              columns={ticketColumns}
              data={ticketRows}
              emptyMessage="Aucun ticket"
            />
          </div>

          <ButtonZbl theme="light" navTo="/admin/back-office/reservations">
            Retour
          </ButtonZbl>
        </div>
      )}
    </div>
  );
}
