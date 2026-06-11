'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import './formInput.scss';

type FormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'> & {
  children: React.ReactNode;
  isPassword?: boolean;
  error?: string;
  as?: 'input' | 'textarea';
  wrapperClassName?: string;
};

/**
 * Reusable form field with label, error handling and accessibility support.
 *
 * Features:
 * - Renders an <input> or a <textarea> depending on the `as` prop.
 * - For password fields (`isPassword`), shows an eye button to toggle the
 *   visibility of the input. The button is disabled while the field is empty.
 * - Handles displaying an error message along with the related ARIA attributes
 *   (`aria-invalid`, `aria-describedby`, `role="alert"`) for accessibility.
 * - Forwards all native attributes (`value`, `onChange`, `placeholder`...) to the element.
 *
 * @example
 * <FormInput
 *   id="email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 * >
 *   <TextZbl color="white" tag="h4">
 *      Email
 *   </TextZbl>
 * </FormInput>
 */
export default function FormInput({
  children,
  as: Tag = 'input',
  wrapperClassName = 'formInput',
  isPassword = false,
  error,
  ...props
}: FormInputProps) {
  const labelId = props.id ? `${props.id}-label` : undefined;
  const errorId = error ? `${props.id}-error` : undefined;

  // --------------------------------------------- \\
  // -------------- PASSWORD POLICY -------------- \\
  // ------Used only when isPassword is true------ \\

  const [isVisiblePassword, setIsPasswordVisible] = useState(false);

  const eyesIcon = useCallback(() => {
    if (!isPassword) return null;

    const iconColor = props.value ? '#e5e5e5' : '#4d4d4d';

    return (
      <button
        type="button"
        className={`form_button ${props.value ? 'form_button_click' : ''}`}
        onClick={() => setIsPasswordVisible((prev) => !prev)}
        disabled={!props.value}
        aria-label={isVisiblePassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {isVisiblePassword ? (
          <EyeOff color={iconColor} size={20} />
        ) : (
          <Eye color={iconColor} size={20} />
        )}
      </button>
    );
  }, [isPassword, isVisiblePassword, props.value]);

  const inputType = useMemo(() => {
    if (isPassword && isVisiblePassword) {
      return 'text';
    }

    return props.type;
  }, [isPassword, isVisiblePassword, props.type]);
  // --------------------------------------------- \\
  // --------------------------------------------- \\

  return (
    <div className={wrapperClassName}>
      <label id={labelId} className="signupForm_label">
        {children}
      </label>
      {Tag === 'textarea' ? (
        <textarea
          aria-labelledby={labelId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <>
          <input
            aria-labelledby={labelId}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            {...props}
            type={inputType}
            className={`formInput__field ${props.className ? props.className : ''}`}
          />
          {isPassword ? eyesIcon() : undefined}
        </>
      )}
      {error && (
        <span id={errorId} className="formInput__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
