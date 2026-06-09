'use client';
import useFetch from '@hooks/api-request/useFetch';
import Hero from './hero/Hero';
import HomeActivites from './activities/Activities';
import HomeBookings from './booking/Booking';
import Loading from '../../../app/loading';
import { ActivityWithCategory } from '@customTypes/collections/activity';
import { useAuth } from '@context/authProvider';

export default function HomePage() {
  const { data, loading, error } = useFetch<ActivityWithCategory[]>('/api/activity');
  const { user } = useAuth();
  if (loading) {
    return <Loading />;
  }

  if (error) {
    throw new Error('Erreur durant la récupération des données "activity"');
  }

  return (
    <>
      {data ? (
        <>
          <Hero activities={data} />
          <HomeActivites activities={data} />
        </>
      ) : undefined}
      <HomeBookings />
    </>
  );
}
