import DataTable, { Column } from '@components/block/data-table/DataTable';
import OccupancyChart from '@components/block/occupancy-chart/OccupancyChart';
import StatCards, { Stat } from '@components/block/stat-card/StatCards';
import StatusBadge, { BadgeStatus } from '@components/ui/status-badge/StatusBadge';
import DropDownZbl from '@components/ui/drop-down-zbl/DropDownZbl';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { FilterPeriod } from '@customTypes/enum/filterPeriod';

type ContentBackOfficeProps = {
  stats: Stat[];
  period: string;
  onPeriodChange: (value: string) => void;
};
const PERIOD_OPTIONS = [
  { label: "Aujourd'hui", value: FilterPeriod.TODAY },
  { label: 'Dernière semaine', value: FilterPeriod.LAST_WEEK },
  { label: 'Mois dernier', value: FilterPeriod.LAST_MONTH },
];

export default function ContentBackOffice({
  stats,
  period,
  onPeriodChange,
}: ContentBackOfficeProps) {
  type ActivityRow = {
    id: number;
    name: string;
    status: BadgeStatus;
    capacity: number;
    date: string;
  };

  const activityColumns = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Activité' },
    { key: 'date', label: 'Date' },
    {
      key: 'status',
      label: 'Statut',
      render: (val: unknown) => <StatusBadge status={val as BadgeStatus} />,
    },
  ];

  const mockActivities: ActivityRow[] = [
    { id: 1, name: 'Zombie Escape', status: 'open', capacity: 20, date: '22/05/2026' },
    { id: 2, name: 'Survival Run', status: 'validated', capacity: 15, date: '23/05/2026' },
    { id: 3, name: 'Dark Maze', status: 'pending', capacity: 10, date: '24/05/2026' },
    { id: 4, name: 'Horror Hunt', status: 'cancel', capacity: 12, date: '25/05/2026' },
    { id: 5, name: 'Zombie Escape', status: 'close', capacity: 20, date: '26/05/2026' },
  ];

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
        <DataTable
          columns={activityColumns as Column<Record<string, unknown>>[]}
          data={mockActivities}
          searchKeys={['name', 'status']}
        />
      </section>
    </>
  );
}
