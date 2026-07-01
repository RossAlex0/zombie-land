'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import StatusBadge, { BadgeStatus } from '@components/ui/status-badge/StatusBadge';
import DataTable, { Column } from '@components/block/data-table/DataTable';
import ConfirmModal from '@components/block/modal-zbl/confirm-modal/ConfirmModal';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import { fetchWithAuth } from '@shared/fetchWithAuth';
import '../../backoffice.scss';
import './reservation-detail.scss';
import { BookingStatus, BookingWithTickets } from '@customTypes/collections/booking';

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

const ticketColumns: Column<TicketRow>[] = [
  { key: 'reservation_number', label: 'N° réservation', truncate: true },
  { key: 'category_label', label: 'Catégorie' },
  { key: 'reduction', label: 'Réduction' },
  { key: 'unit_price', label: 'Prix unitaire' },
  { key: 'validity_date', label: 'Validité' },
];

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: booking, loading, error } = useFetch<BookingWithTickets>(`/api/booking/${id}`);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Soft-cancel restricted to pending bookings: no payment, so no refund concern.
  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetchWithAuth(`/api/booking/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error("La réservation n'a pas pu être annulée.");
      }
      clearCache(`/api/booking/${id}`);
      router.push('/admin/back-office/reservations');
    } finally {
      setCancelling(false);
      setConfirmOpen(false);
    }
  };

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

          <div className="reservation-detail__actions">
            <ButtonZbl theme="light" navTo="/admin/back-office/reservations">
              Retour
            </ButtonZbl>
            {booking.status === BookingStatus.PENDING && (
              <ButtonZbl
                theme="custom"
                className="btn-danger"
                navTo=""
                aria-label="Annuler la réservation"
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmOpen(true);
                }}
              >
                <Trash2 size={16} />
                <span className="btn-label">Annuler</span>
              </ButtonZbl>
            )}
          </div>

          <ConfirmModal
            isOpen={confirmOpen}
            title="Annuler la réservation"
            message={`Annuler la réservation ${booking.reference} ? Cette action est irréversible.`}
            confirmLabel={cancelling ? 'Annulation…' : 'Oui, annuler'}
            cancelLabel="Retour"
            danger
            onConfirm={handleCancel}
            onCancel={() => setConfirmOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
