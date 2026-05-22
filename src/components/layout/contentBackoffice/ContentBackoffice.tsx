import DataTable, { Column } from '@components/block/dataTable/DataTable';
import StatCards from '@components/block/statCards/StatCards';
import StatusBadge, { BadgeStatus } from '@components/ui/statusBadge/StatusBadge';

export default function ContentBackOffice() {
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
    { key: 'capacity', label: 'Capacité' },
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
  const stats = [
    {
      label: 'Réservations',
      value: 41,
      color: 'green',
      lowLevel: 10,
      highLevel: 40,
    },
    {
      label: 'Tickets vendues',
      value: 68,
      color: 'yellow',
      lowLevel: 20,
      highLevel: 100,
    },
    {
      label: "Chiffres d'affaires",
      value: 1180,
      color: 'yellow',
      unit: '€',
      lowLevel: 600,
      highLevel: 2000,
    },
    {
      label: 'Taux de remplissage',
      value: 44,
      color: 'red',
      unit: '%',
      lowLevel: 50,
      highLevel: 75,
    },
  ];

  return (
    <section>
      <StatCards stats={stats} />
      <DataTable
        columns={activityColumns as Column<Record<string, unknown>>[]}
        data={mockActivities}
        searchKeys={['name', 'status']}
      />
    </section>
  );
}
