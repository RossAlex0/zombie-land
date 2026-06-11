import TextZbl from '../text-zbl/TextZbl';
import './statCardZbl.scss';

type StatCardZblProps = {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'green' | 'yellow' | 'red';
};

export default function StatCardZbl({ label, value, unit, color = 'yellow' }: StatCardZblProps) {
  return (
    <div className="stat-card">
      <TextZbl tag="p" jetbrains className="stat-card__label">
        {label}
      </TextZbl>
      <p className={`stat-card__value stat-card__value--${color}`}>
        {value}
        {unit && <span className="stat-card__unit"> {unit}</span>}
      </p>
    </div>
  );
}
