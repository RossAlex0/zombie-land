import { category } from '@prismaInstance/*';
import TextZbl from '../textZbl/TextZbl';

import './chips.scss';
type ChipsProps = {
  category: category;
  isActive: boolean;
  onClick: (id: number) => void;
};

export default function Chips({ category, isActive = false, onClick }: ChipsProps) {
  const labelColor = isActive ? 'yellow' : 'white';
  return (
    <button
      className={isActive ? 'chips chips_active' : 'chips'}
      onClick={() => onClick(category.id)}
    >
      <TextZbl color={labelColor} jetbrains>
        {category.label}
      </TextZbl>
    </button>
  );
}
