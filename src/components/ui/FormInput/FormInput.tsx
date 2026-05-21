import React from 'react';
import './FormInput.scss';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  children: React.ReactNode;
};
export default function FormInput({ children, ...props }: FormInputProps) {
  return (
    <div className="signupForm_div">
      <label htmlFor={props.id} className="signupForm_label">
        {children}
      </label>
      <input {...props} />
    </div>
  );
}
