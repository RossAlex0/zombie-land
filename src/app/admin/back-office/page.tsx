'use client';
import { FilterPeriod } from '@customTypes/enum/filterPeriod';
import { useState } from 'react';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ContentBackOffice, {
  BookingRow,
} from '@components/layout/content-back-office/ContentBackoffice';
import { Stat } from '@components/block/stat-card/StatCards';
import useFetch from '@hooks/api-request/useFetch';
import './backoffice.scss';

type DashboardStats = {
  bookings: number;
  ticketsSold: number;
  revenue: number;
};

export default function Home() {
  const [period, setPeriod] = useState<string>(FilterPeriod.TODAY);
  const { data, loading, error } = useFetch<DashboardStats>(`/api/dashboard?period=${period}`);
  const { data: bookings } = useFetch<BookingRow[]>('/api/booking');

  const recentBookings = [...(bookings ?? [])].sort((a, b) => b.id - a.id).slice(0, 10);

  const stats: Stat[] = [
    { label: 'Réservations', value: data?.bookings ?? 0, lowLevel: 10, highLevel: 40 },
    { label: 'Tickets vendues', value: data?.ticketsSold ?? 0, lowLevel: 20, highLevel: 100 },
    {
      label: "Chiffres d'affaires",
      value: data?.revenue ?? 0,
      unit: '€',
      lowLevel: 600,
      highLevel: 2000,
    },
  ];

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Dashboard globale</TextZbl>
          </div>
        </div>
      </div>

      {loading && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}

      <ContentBackOffice
        stats={stats}
        period={period}
        onPeriodChange={setPeriod}
        recentBookings={recentBookings}
      />
    </div>
  );
}
