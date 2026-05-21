'use client';

import ParkMap from '@components/block/park-map/ParkMap';
import TextZbl from '@components/ui/textZbl/TextZbl';
import { NotepadText, Radiation, RollerCoaster, ArrowRight } from 'lucide-react';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import useFetch from '@hooks/api-request/useFetch';
import type { activity } from '@prismaInstance/*';

import './hero.scss';

export default function Hero() {
  const { data, loading, error } = useFetch<Partial<activity[]>>('/api/activity');

  if (loading) {
    //TODO: Create a loading component
    return <p>Loading</p>;
  }

  if (error && !data) {
    console.info(error);
  }

  return (
    <section className="hero">
      <div className="hero_text">
        <TextZbl jetbrains color="red">
          <NotepadText size={16} />
          <span>Section_001 - manuel d’entrée</span>
        </TextZbl>
        <span className="hero_text_title" style={{ marginBottom: '-1rem' }}>
          <TextZbl tag="h2">BIENVENUE À </TextZbl>
          <TextZbl tag="h2" color="red">
            &nbsp;ZOMBIE LAND
          </TextZbl>
        </span>
        <span className="hero_text_title">
          <TextZbl redPrefix="//">Status: </TextZbl>
          <TextZbl color="yellow">&nbsp;CONTAMINER&nbsp;&nbsp;</TextZbl>
          <TextZbl redPrefix="//">48.8566°N — 2.3522°E</TextZbl>
        </span>
        <TextZbl>
          Le dernier parc d’attractions encore ouvert après l’effondrement nucléaire mais aussi le
          foyer de la contamination où le patient zero fut découvert. Douze attractions, des zombies
          à perte de vue ou une seule regle prime: SURVIR
          <br />
          Seule les personnes les plus téméraires seront admisse au sein de l’unité des survivants,
          votre courage et votre agilité seront mise à rude épreuves.
        </TextZbl>
        <span className="hero_text_title">
          <TextZbl color="yellow" jetbrains>
            <Radiation size={20} />
            126
          </TextZbl>
          <TextZbl jetbrains>&nbsp;jours depuis le découverte du patient 0</TextZbl>
        </span>
        <span className="hero_text_title">
          <TextZbl color="yellow" jetbrains>
            <RollerCoaster size={20} />
            {data?.length ?? 0}
          </TextZbl>
          <TextZbl jetbrains>&nbsp;attractions térrifiantes</TextZbl>
        </span>
        <ButtonZbl navTo="/activity" theme="light" className="hero_text_btn">
          <TextZbl color="black" jetbrains>
            Reserver l&apos;entrée <ArrowRight size={18} />
          </TextZbl>
        </ButtonZbl>
      </div>
      <div className="hero_map">
        <ParkMap />
        <div className="hero_map_desc">
          <TextZbl redPrefix="//">Zombie_land_01&nbsp;&nbsp;</TextZbl>
          <TextZbl redPrefix="//">Plan_tactique_032&nbsp;&nbsp;</TextZbl>
          <TextZbl redPrefix="//">48.8566°N — 2.3522°E</TextZbl>
        </div>
      </div>
    </section>
  );
}
