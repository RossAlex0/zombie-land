'use client';
import TextZbl from '@components/ui/textZbl/TextZbl';
import { ActivityWithCategory } from '@customTypes/collections/activity';
import useFetch from '@hooks/api-request/useFetch';
import { useParams } from 'next/navigation';
import Loading from '../../../loading';

import './activity.scss';
import Image from 'next/image';
import { parseDateWithoutTime } from '@shared/date';
import AttractionsCarousel from '@components/block/carousel/CarouselZbl';
import { useMemo } from 'react';
export default function ActivityDetails() {
  const { activityId } = useParams();

  const {
    data: activity,
    loading: loadingActivity,
    error: errorActivity,
  } = useFetch<ActivityWithCategory>(`/api/activity/${activityId}`);

  const { id: categoryId, label } = useMemo(
    () => activity?.category_activity[0]?.category ?? { id: null, label: null },
    [activity]
  );

  const { data: activities } = useFetch<ActivityWithCategory[]>(
    categoryId ? `/api/activity?category=${categoryId}` : null
  );

  if (loadingActivity) {
    return <Loading />;
  }

  if (errorActivity) {
    throw new Error(
      `Erreur durant la récupération des données sur la page ( /activity/${activityId} )`
    );
  }

  return (
    <section className="activity_details">
      <div className="activity_details_desc">
        <div className="activity_details_desc_text">
          <div className="activity_details_desc_text_cat">
            <TextZbl tag="h1">{activity?.name}</TextZbl>

            {activity?.category_activity.map((c) => (
              <TextZbl tag="h4" redPrefix="//" color="grey" key={c.category_id} jetbrains>
                {c.category.label}
              </TextZbl>
            ))}
          </div>
          <TextZbl tag="p">
            {activity?.description ?? 'Acune description pour cette attraction.'}
          </TextZbl>
          {activity?.created_at ? (
            <TextZbl jetbrains redPrefix="//" color="grey">
              Zone contaminée depuis le : {parseDateWithoutTime(activity.created_at)}
            </TextZbl>
          ) : undefined}
          <TextZbl tag="p" redPrefix="//" color="grey" jetbrains>
            Status de la zone : {activity?.status}
          </TextZbl>
        </div>
        <div className="activity_details_desc_img">
          <Image
            src={activity?.picture ? activity.picture : '/images/default-activity.webp'}
            fill
            loading="lazy"
            alt="Attraction"
            className="activity_details_desc_img_picture"
          />
        </div>
      </div>
      <div className="details_separtor" />
      <div className="activity_details_carousel">
        <TextZbl tag="h2">{`Plus d'expériences ${label}`}</TextZbl>
        {activities && activities.length !== 0 ? (
          <AttractionsCarousel activities={activities} />
        ) : undefined}
      </div>
    </section>
  );
}
