import React from 'react';
import './FormInput.scss';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  children: React.ReactNode;
  className: string;
  error?: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
};
export default function FormInput({ children, error, ...props }: FormInputProps) {
  const errorId = error ? `${props.id}-error` : undefined;
  return (
    <div className="formInput">
      <label htmlFor={props.id} className="signupForm_label">
        {children}
      </label>
      <input aria-invalid={error ? true : undefined} aria-describedby={errorId} {...props} />
      {error && (
        <span id={errorId} className="formInput__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
