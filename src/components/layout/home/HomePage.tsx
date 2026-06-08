'use client';
import useFetch from '@hooks/api-request/useFetch';
import Hero from './hero/Hero';
import { activity } from '@prismaInstance/*';
import HomeActivites from './activities/Activities';
import HomeBookings from './booking/Booking';

export default function HomePage() {
  const { data, loading, error } = useFetch<Partial<activity[]>>('/api/activity');

  if (loading) {
    //TODO: Create a loading component
    return <p>Loading</p>;
  }

  if (error || !data || !data.length) {
    console.info(error);
    return;
  }

  return (
    <>
      <Hero activities={data} />
      <HomeActivites activities={data} />
      <HomeBookings />
    </>
  );
}
