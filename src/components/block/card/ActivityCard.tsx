import TextZbl from '@components/ui/textZbl/TextZbl';
import Image from 'next/image';
import type { ActivityWithCategory } from '@customTypes/collections/activity';
import './activityCard.scss';

export default function ActivityCard({ activity }: { activity: ActivityWithCategory }) {
  return (
    <div className="card">
      <div className="card_image">
        <Image
          src={activity.picture ? activity.picture : '/images/default-activity.webp'}
          fill
          loading="lazy"
          alt="Attraction"
        />
      </div>
      <div className="card_header">
        <div className="card_header_span">
          <TextZbl jetbrains color="yellow">{`ATTR-0${activity.id}`}</TextZbl>
        </div>
      </div>
      <div className="card_title">
        {activity.category_activity[0]?.category?.label ? (
          <TextZbl color="grey" redPrefix="//">
            {activity.category_activity[0].category.label}
          </TextZbl>
        ) : undefined}
        <TextZbl tag="h2">{activity.name}</TextZbl>
      </div>
    </div>
  );
}
