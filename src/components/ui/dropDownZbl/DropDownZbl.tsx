'use client';

import { useState, useRef, ButtonHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { useClickOutside } from '@hooks/useClickOutside';
import TextZbl from '../textZbl/TextZbl';

import './dropDownZbl.scss';

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> & {
  options: DropdownOption[];
  value?: string;
  onChange?: (option: DropdownOption) => void;
  classNameDiv?: string;
};

export default function DropDownZbl({
  options,
  value,
  onChange,
  classNameDiv = '',
  disabled,
  ...rest
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const selected = value
    ? (options.find((opt) => opt.value === value) ?? options[0])
    : internalValue;

  const handleSelect = (option: DropdownOption) => {
    setInternalValue(option);
    onChange?.(option);
    setIsOpen(false);
  };

  const wrapperClasses = ['dropdown', isOpen && 'open', disabled && 'disabled', classNameDiv]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses} ref={dropdownRef}>
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        {...rest}
      >
        <TextZbl jetbrains>{selected.label}</TextZbl>
        <ChevronDown className="dropdown-arrow" size={18} />
      </button>

      {isOpen && (
        <ul className="dropdown-menu" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === selected.value}
              className={`dropdown-option ${option.value === selected.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              <TextZbl jetbrains>{option.label}</TextZbl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
