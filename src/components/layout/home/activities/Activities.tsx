import TextZbl from '@components/ui/textZbl/TextZbl';
import { NotepadText } from 'lucide-react';
import type { activity } from '@prismaInstance/*';
import AttractionsCarousel from '@components/block/carousel/CarouselZbl';

import './homeActivities.scss';

export default function HomeActivites({ activities }: { activities: Partial<activity[]> }) {
  return (
    <section className="home_activities">
      <div className="home_activities_text">
        <TextZbl jetbrains color="red">
          <NotepadText size={16} />
          <span>Section_002 - inventaires des attractions</span>
        </TextZbl>
        <span className="home_activities_text_title" style={{ marginBottom: '-1rem' }}>
          <TextZbl tag="h2">{activities?.length} façons</TextZbl>
          <TextZbl tag="h2" color="red">
            &nbsp;DE NE PAS&nbsp;
          </TextZbl>
          <TextZbl tag="h2">survir</TextZbl>
        </span>
      </div>
      <div>
        <AttractionsCarousel activities={activities} />
      </div>
    </section>
  );
}
