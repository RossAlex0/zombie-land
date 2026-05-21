import './StatusBadge.scss';
import TextZbl from '@components/ui/textZbl/TextZbl';
export type BadgeStatus = 'pending' | 'validated' | 'open' | 'cancel' | 'close';

type StatusBadgeProps = {
  status: BadgeStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = status === 'close' || status === 'cancel' ? 'white' : 'black';
  return (
    <span className={`status-badge status-badge--${status}`}>
      <TextZbl color={color} jetbrains>
        {status}
      </TextZbl>
    </span>
  );
}
