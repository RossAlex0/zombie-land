'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import { Printer, Hash, Calendar1, Ticket } from 'lucide-react';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import useFetch from '@hooks/api-request/useFetch';
import { parseDateFr } from '@shared/date';
import './billet.scss';

type Billet = {
  id: number;
  reservation_number: string;
  category_label: string;
  validity_date: string;
  qr_token: string;
};

type BilletData = {
  reference: string;
  start_at: string;
  end_at: string;
  billets: Billet[];
};

export default function BilletPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { data, loading, error } = useFetch<BilletData>(`/api/booking/me/${bookingId}/billet`);

  if (loading) {
    return (
      <section className="billet">
        <span className="billet_spinner" role="status" aria-label="Loading" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="billet">
        <TextZbl jetbrains color="yellow">
          Impossible de charger vos billets.
        </TextZbl>
        <ButtonZbl theme="dark" navTo="/booking/me">
          <TextZbl color="yellow">Retour à mes réservations</TextZbl>
        </ButtonZbl>
      </section>
    );
  }

  if (data.billets.length === 0) {
    return (
      <section className="billet">
        <TextZbl jetbrains color="grey" redPrefix="//">
          Aucun billet disponible pour cette réservation. Un billet est généré une fois le paiement
          confirmé (et la réservation non annulée).
        </TextZbl>
        <ButtonZbl theme="dark" navTo="/booking/me">
          <TextZbl color="yellow">Retour à mes réservations</TextZbl>
        </ButtonZbl>
      </section>
    );
  }

  return (
    <section className="billet">
      <div className="billet_header no-print">
        <div className="billet_header_title">
          <TextZbl tag="h1">MES</TextZbl>
          <TextZbl tag="h1" color="red">
            &nbsp;BILLETS
          </TextZbl>
        </div>
        <div className="billet_header_actions">
          <ButtonZbl
            onClick={(e) => {
              e.preventDefault(); // ButtonZbl navigates to navTo ('/') by default — block it.
              window.print();
            }}
          >
            <span className="billet_print_label">
              <Printer size={18} /> Télécharger / Imprimer
            </span>
          </ButtonZbl>
          <ButtonZbl theme="dark" navTo="/booking/me">
            <TextZbl color="yellow">Retour</TextZbl>
          </ButtonZbl>
        </div>
      </div>

      <div className="billet_list">
        {data.billets.map((billet) => (
          <article key={billet.id} className="billet_ticket">
            <div className="billet_ticket_info">
              <div className="billet_ticket_brand">
                <Image src="/icons/logo.svg" alt="Zombie Land" width={32} height={32} />
                <TextZbl jetbrains color="yellow">
                  ZOMBIE LAND
                </TextZbl>
              </div>
              <div className="billet_ticket_row">
                <Hash color="#ac382a" size={16} />
                <TextZbl jetbrains color="grey">
                  {billet.reservation_number}
                </TextZbl>
              </div>
              <div className="billet_ticket_row">
                <Ticket color="#ac382a" size={16} />
                <TextZbl jetbrains>{billet.category_label}</TextZbl>
              </div>
              <div className="billet_ticket_row">
                <Calendar1 color="#ac382a" size={16} />
                <TextZbl jetbrains>
                  Valable le {parseDateFr(new Date(billet.validity_date))}
                </TextZbl>
              </div>
              <TextZbl jetbrains color="grey" redPrefix="//">
                {data.reference}
              </TextZbl>
            </div>
            <div className="billet_ticket_qr">
              <QRCode value={billet.qr_token} size={148} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
