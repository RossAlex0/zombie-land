'use client';
import ParkMap from '@components/block/park-map/ParkMap';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { NotepadText, Radiation, RollerCoaster, ArrowRight } from 'lucide-react';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import type { activity, configuration } from '@prismaInstance/*';
import { getNbDays } from '@shared/date';
import { useMemo } from 'react';

import './hero.scss';

type HeroProps = {
  activities: Partial<activity[]>;
  config: configuration;
};

export default function Hero({ activities, config }: HeroProps) {
  const daysOpen = useMemo(() => getNbDays(config.created_at, new Date()), [config.created_at]);
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
          <TextZbl color="yellow">&nbsp;CONTAMINE&nbsp;&nbsp;</TextZbl>
          <TextZbl redPrefix="//">48.8566°N — 2.3522°E</TextZbl>
        </span>
        <TextZbl>
          Le dernier parc d’attractions encore ouvert après l’effondrement nucléaire mais aussi le
          foyer de la contamination où le patient zero fut découvert. Douze attractions, des zombies
          à perte de vue où une seule regle prime: SURVIVRE
          <br />
          Seule les personnes les plus téméraires seront admises au sein de l’unité des survivants,
          votre courage et votre agilité seront mis à rude épreuves.
        </TextZbl>
        <span className="hero_text_title">
          <TextZbl color="yellow" jetbrains>
            <Radiation size={20} />
            {daysOpen}
          </TextZbl>
          <TextZbl jetbrains>&nbsp;jours depuis le découverte du patient 0</TextZbl>
        </span>
        <span className="hero_text_title">
          <TextZbl color="yellow" jetbrains>
            <RollerCoaster size={20} />
            {activities?.length ?? 0}
          </TextZbl>
          <TextZbl jetbrains>&nbsp;attractions terrifiantes</TextZbl>
        </span>
        <ButtonZbl navTo="/booking" theme="light" className="hero_text_btn">
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
