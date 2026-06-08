'use client';
import useFetch from '@hooks/api-request/useFetch';
import Hero from './hero/Hero';
import { activity } from '@prismaInstance/*';
import HomeActivites from './activities/Activities';
import HomeBookings from './booking/Booking';
import Loading from '../../../app/loading';

export default function HomePage() {
  const { data, loading, error } = useFetch<Partial<activity[]>>('/api/activity');

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    throw new Error('Erreur durant la récupération des données "activity"');
  }

  return (
    <>
      <Hero activities={data} />
      <HomeActivites activities={data} />
      <HomeBookings />
    </>
  );
}
