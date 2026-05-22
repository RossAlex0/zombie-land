import React from 'react';
import './FormInput.scss';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  children: React.ReactNode;
  className: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
};
export default function FormInput({ children, ...props }: FormInputProps) {
  return (
    <div className="formInput">
      <label htmlFor={props.id} className="signupForm_label">
        {children}
      </label>
      <input {...props} />
    </div>
  );
}
