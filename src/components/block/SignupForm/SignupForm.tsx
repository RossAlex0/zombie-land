'use client';
import React from 'react';
import Link from 'next/link';

import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import './SignupForm.scss';

import FormInput from '@components/ui/FormInput/FormInput';
import TextZbl from '@components/ui/textZbl/TextZbl';

import useSignup from '@hooks/auth/useSignup';

type FieldName = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword';

const fields: {
  type: string;
  id: string;
  name: FieldName;
  // clé renvoyée par le back (schéma Zod en snake_case)
  errorKey: string;
  text: string;
  placeholder: string;
  autoComplete: string;
}[] = [
  {
    type: 'text',
    id: 'signupFirstName',
    name: 'firstName',
    errorKey: 'first_name',
    text: 'Prénom',
    placeholder: 'Prénom',
    autoComplete: 'given-name',
  },
  {
    type: 'text',
    id: 'signupLastName',
    name: 'lastName',
    errorKey: 'last_name',
    text: 'Nom',
    placeholder: 'Nom',
    autoComplete: 'family-name',
  },
  {
    type: 'email',
    id: 'signupEmail',
    name: 'email',
    errorKey: 'email',
    text: 'Email',
    placeholder: 'Email',
    autoComplete: 'email',
  },
  {
    type: 'password',
    id: 'signupPassword',
    name: 'password',
    errorKey: 'password',
    text: 'Mot de passe',
    placeholder: 'Mot de passe',
    autoComplete: 'new-password',
  },
  {
    type: 'password',
    id: 'signupConfirmPassword',
    name: 'confirmPassword',
    errorKey: 'confirmPassword',
    text: 'Confirmez le mot de passe',
    placeholder: 'Confirmation du mot de passe',
    autoComplete: 'new-password',
  },
];

export default function SignupForm() {
  const { signup, loading, error, fieldErrors } = useSignup();
  const [values, setValues] = React.useState<Record<FieldName, string>>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [mismatch, setMismatch] = React.useState(false);

  const handleChange = (name: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
    if (name === 'password' || name === 'confirmPassword') setMismatch(false);
  };

  // message global affiché seulement s'il n'y a pas d'erreur ciblée par champ
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return (
    <form
      className="signupForm"
      onSubmit={async (e) => {
        e.preventDefault();
        if (values.password !== values.confirmPassword) {
          setMismatch(true);
          return;
        }
        await signup({
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
      }}
    >
      <TextZbl tag="h2" className="signupForm__title">
        Se déclarer parmi les survivants
      </TextZbl>
      <div className="formFields">
        {fields.map((field) => {
          const fieldError =
            field.name === 'confirmPassword' && mismatch
              ? 'Les mots de passe ne correspondent pas'
              : fieldErrors[field.errorKey];
          return (
            <FormInput
              key={field.id}
              type={field.type}
              id={field.id}
              name={field.name}
              className={'formInput__field signupForm__input'}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={handleChange(field.name)}
              autoComplete={field.autoComplete}
              disabled={loading}
              error={fieldError}
              required
            >
              <TextZbl color="white" tag="h3">
                {field.text}
              </TextZbl>
            </FormInput>
          );
        })}
      </div>

      {/* message global uniquement quand l'erreur n'est pas ciblée sur un champ */}
      {error && !hasFieldErrors && (
        <TextZbl color="red" jetbrains role="alert">
          {error}
        </TextZbl>
      )}

      <div className="signupForm__submit">
        <ButtonZbl className="signupForm__button" type="submit" theme="light" disabled={loading}>
          {loading ? 'Inscription…' : "S'inscrire"}
        </ButtonZbl>
      </div>

      <Link href="/auth/login" className="signupForm__link">
        <TextZbl color="grey" jetbrains>
          Déjà un compte ? <span className="signupForm__link-accent">Connectez-vous</span>
        </TextZbl>
      </Link>
    </form>
  );
}
