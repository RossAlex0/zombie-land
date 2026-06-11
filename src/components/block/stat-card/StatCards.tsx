import TextZbl from '@components/ui/text-zbl/TextZbl';
import StatCard from './StatCard';

import './statCards.scss';

export type Stat = {
  label: string;
  value: number;
  lowLevel: number;
  highLevel: number;
  unit?: string;
};

type StatCardsProps = {
  stats: Stat[];
};

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <section className="stat_cards">
      <TextZbl jetbrains className="stat_cards_note">
        *Les chiffres affichés sont calculés suivant la date choisie
      </TextZbl>

      <div className="stat_cards_grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
            lowLevel={stat.lowLevel}
            highLevel={stat.highLevel}
          />
        ))}
      </div>
    </section>
  );
}
