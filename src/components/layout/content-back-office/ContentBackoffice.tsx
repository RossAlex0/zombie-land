import { Eye } from 'lucide-react';
import DataTable, { Column } from '@components/block/data-table/DataTable';
import OccupancyChart from '@components/block/occupancy-chart/OccupancyChart';
import StatCards, { Stat } from '@components/block/stat-card/StatCards';
import StatusBadge, { BadgeStatus } from '@components/ui/status-badge/StatusBadge';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import DropDownZbl from '@components/ui/drop-down-zbl/DropDownZbl';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { FilterPeriod } from '@customTypes/enum/filterPeriod';

export type BookingRow = {
  [key: string]: unknown;
  id: number;
  reference: string;
  status: string;
  start_at: string;
  end_at: string;
  total_paid: string;
  _count: { ticket: number };
};

type ContentBackOfficeProps = {
  stats: Stat[];
  period: string;
  onPeriodChange: (value: string) => void;
  recentBookings: BookingRow[];
};

const bookingColumns: Column<BookingRow>[] = [
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
const PERIOD_OPTIONS = [
  { label: "Aujourd'hui", value: FilterPeriod.TODAY },
  { label: 'Dernière semaine', value: FilterPeriod.LAST_WEEK },
  { label: 'Mois dernier', value: FilterPeriod.LAST_MONTH },
];

export default function ContentBackOffice({
  stats,
  period,
  onPeriodChange,
  recentBookings,
}: ContentBackOfficeProps) {
  return (
    <>
      <section className="dashboard_section">
        <header className="dashboard_section_header">
          <TextZbl jetbrains className="dashboard_section_title">
            Statistiques
          </TextZbl>
          <DropDownZbl
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(opt) => onPeriodChange(opt.value)}
          />
        </header>
        <StatCards stats={stats} />
      </section>

      <section className="dashboard_section">
        <header className="dashboard_section_header">
          <TextZbl jetbrains className="dashboard_section_title">
            Occupation
          </TextZbl>
        </header>
        <div className="occupancy_charts_row">
          <OccupancyChart title="Occupation — 30 derniers jours" field="occupancy" />
          <OccupancyChart title="Prévisionnel — 30 prochains jours" field="upcomingOccupancy" />
        </div>
      </section>

      <section className="dashboard_section">
        <header className="dashboard_section_header">
          <TextZbl jetbrains className="dashboard_section_title">
            Dernières réservations
          </TextZbl>
        </header>
        <DataTable<BookingRow>
          columns={bookingColumns}
          data={recentBookings}
          emptyMessage="Aucune réservation trouvée"
          renderActions={(row) => (
            <ButtonZbl theme="light" navTo={`/admin/back-office/reservations/${row.id}`}>
              <Eye size={16} />
              <span className="btn-label">Voir</span>
            </ButtonZbl>
          )}
        />
      </section>
    </>
  );
}
