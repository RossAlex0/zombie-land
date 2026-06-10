import TextZbl from '@components/ui/textZbl/TextZbl';
import './BackOfficeField.scss';

type BackOfficeFieldProps = {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
};

export default function BackOfficeField({ label, children, fullWidth }: BackOfficeFieldProps) {
  return (
    <div className={`backoffice-field${fullWidth ? ' backoffice-field--full' : ''}`}>
      <TextZbl jetbrains>{label}</TextZbl>
      {children}
    </div>
  );
}
