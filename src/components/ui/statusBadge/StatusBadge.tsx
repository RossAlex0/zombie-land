import './StatusBadge.scss';

export type BadgeStatus = 'pending' | 'validated' | 'open' | 'cancel' | 'close';

type StatusBadgeProps = {
  status: BadgeStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{status}</span>;
}
