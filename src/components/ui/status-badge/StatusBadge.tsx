import TextZbl from '../text-zbl/TextZbl';
import './statusBadge.scss';
export type BadgeStatus =
  | 'pending'
  | 'paid'
  | 'validated'
  | 'valid'
  | 'open'
  | 'confirmed'
  | 'cancel'
  | 'cancelled'
  | 'close';

type StatusBadgeProps = {
  status: BadgeStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color =
    status === 'close' || status === 'cancel' || status === 'cancelled' ? 'white' : 'black';
  return (
    <span className={`status-badge status-badge--${status}`}>
      <TextZbl color={color} jetbrains>
        {status}
      </TextZbl>
    </span>
  );
}
