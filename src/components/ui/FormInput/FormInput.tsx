import React from 'react';
import './FormInput.scss';

type FormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'> & {
  children: React.ReactNode;
  error?: string;
  as?: 'input' | 'textarea';
  wrapperClassName?: string;
};

export default function FormInput({
  children,
  error,
  as: Tag = 'input',
  wrapperClassName = 'formInput',
  ...props
}: FormInputProps) {
  const labelId = props.id ? `${props.id}-label` : undefined;
  const errorId = error && props.id ? `${props.id}-error` : undefined;
  return (
    <div className={wrapperClassName}>
      <div id={labelId} className="signupForm_label">
        {children}
      </div>
      {Tag === 'textarea' ? (
        <textarea
          aria-labelledby={labelId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          aria-labelledby={labelId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...props}
        />
      )}
      {error && (
        <span id={errorId} className="formInput__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
