import StatCards from '@components/block/statCards/StatCards';

export default function ContentBackOffice() {
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
    </section>
  );
}
