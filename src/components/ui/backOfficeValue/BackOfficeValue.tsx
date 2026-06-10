import TextZbl from '@components/ui/textZbl/TextZbl';
import './BackOfficeValue.scss';

type BackOfficeValueProps = {
  label: string;
  children: React.ReactNode;
  color?: 'white' | 'yellow';
};

export default function BackOfficeValue({
  label,
  children,
  color = 'white',
}: BackOfficeValueProps) {
  return (
    <div className="backoffice-value">
      <TextZbl jetbrains>{label}</TextZbl>
      <TextZbl jetbrains color={color} className="backoffice-value__content">
        {children}
      </TextZbl>
    </div>
  );
}
