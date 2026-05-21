import TextZbl from '@components/ui/textZbl/TextZbl';
import { HTMLAttributes, useMemo } from 'react';
import { Stat } from './StatCards';
import './statCards.scss';

type StatCardProps = HTMLAttributes<HTMLDivElement> & Stat;

function getLevel(value: number, lowLevel: number, highLevel: number) {
  if (value < lowLevel) return 'low';
  if (value >= highLevel) return 'high';
  return 'medium';
}

export default function StatCard({
  label,
  value,
  unit,
  lowLevel,
  highLevel,
  ...props
}: StatCardProps) {
  const level = useMemo(() => getLevel(value, lowLevel, highLevel), [value, lowLevel, highLevel]);

  return (
    <div className="stat_card" {...props}>
      <TextZbl jetbrains>{label}</TextZbl>
      <TextZbl jetbrains className={`stat_card_value ${level}`}>
        {value}
        {unit && ` ${unit}`}
      </TextZbl>
    </div>
  );
}
