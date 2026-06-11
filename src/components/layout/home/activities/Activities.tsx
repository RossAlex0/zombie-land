import TextZbl from '@components/ui/text-zbl/TextZbl';
import { NotepadText, RollerCoaster } from 'lucide-react';
import AttractionsCarousel from '@components/block/carousel/CarouselZbl';
import { ActivityWithCategory } from '@customTypes/collections/activity';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import './homeActivities.scss';

export default function HomeActivites({ activities }: { activities: ActivityWithCategory[] }) {
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
      <div>
        <ButtonZbl theme="dark" style={{ margin: 'auto' }} navTo="/activity">
          <RollerCoaster size={20} color="#e5bf00" />
          <TextZbl color="yellow" jetbrains>
            Voir les attractions
          </TextZbl>
        </ButtonZbl>
      </div>
    </section>
  );
}
