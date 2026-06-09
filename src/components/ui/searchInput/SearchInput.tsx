import { Search } from 'lucide-react';
import './searchInput.scss';

type SearchInputProps = {
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Rechercher une attraction...',
}: SearchInputProps) {
  return (
    <div className="search_input">
      <Search size={16} className="search_input_icon" />
      <input
        type="text"
        className="search_input_field"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
