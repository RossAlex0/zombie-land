import React from 'react';
import TextZbl from '@components/ui/textZbl/TextZbl';
import './FormInput.scss';

export type FormInputProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ label, id, className, ...props }: FormInputProps) {
  return (
    <div className="form-input">
      <TextZbl tag="p" jetbrains redPrefix="---">
        {label}
      </TextZbl>
      <input id={id} className={`form-input__field ${className ?? ''}`.trim()} {...props} />
    </div>
  );
}
