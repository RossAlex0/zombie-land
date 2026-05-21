import AdminLayout from '@components/layout/AdminLayout';
import StatCardZbl from '@components/ui/statCardZbl/StatCardZbl';
import './test.scss';

export default function Home() {
  return (
    <AdminLayout>
      <div className="test-stats">
        <StatCardZbl label="Réservations" value={41} color="green" />
        <StatCardZbl label="Tickets vendues" value={68} color="yellow" />
        <StatCardZbl label="Chiffres d'affaires" value={1180} unit="€" color="yellow" />
        <StatCardZbl label="Taux de remplissage" value={44} unit="%" color="red" />
      </div>
    </AdminLayout>
  );
}
