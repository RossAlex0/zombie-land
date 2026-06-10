'use client';
import useFetch from '@hooks/api-request/useFetch';
import Hero from './hero/Hero';
import HomeActivites from './activities/Activities';
import HomeBookings from './booking/Booking';
import Loading from '../../../app/loading';
import { ActivityWithCategory } from '@customTypes/collections/activity';
import { configuration } from '@prismaInstance/*';

export default function HomePage() {
  const {
    data: activities,
    loading: loadingActivities,
    error: errorActivities,
  } = useFetch<ActivityWithCategory[]>('/api/activity');
  const {
    data: config,
    loading: loadingConfig,
    error: errorConfig,
  } = useFetch<configuration>('/api/configuration');

  if (loadingActivities || loadingConfig) {
    return <Loading />;
  }

  if (errorActivities || errorConfig) {
    throw new Error('Erreur durant la récupération des données "activity"');
  }

  return (
    <>
      {activities && config ? (
        <>
          <Hero activities={activities} config={config} />
          <HomeActivites activities={activities} />
          <HomeBookings config={config} />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
