'use client';
import React from 'react';
import Link from 'next/link';
import TextZbl from '@components/ui/textZbl/TextZbl';
import useResetPassword from '@hooks/api-request/auth/useResetPassword';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import FormInput from '@components/ui/FormInput/FormInput';
import './resetPasswordForm.scss';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (email: string): string | null => {
  if (!email.trim()) return 'Veuillez renseigner votre email.';
  if (!EMAIL_REGEX.test(email)) return 'Format d’email invalide.';
  return null;
};

const friendlyError = (raw: string): string => {
  if (raw.startsWith('Erreur 5')) return 'Le serveur est indisponible, réessayez plus tard.';
  if (raw === 'Erreur réseau' || raw === 'Failed to fetch')
    return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
  return raw;
};

export default function ResetPasswordForm() {
  const [email, setEmail] = React.useState('');
  const [clientError, setClientError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const { requestReset, loading, error } = useResetPassword();

  const displayedError = clientError ?? (error && friendlyError(error));

  if (submitted) {
    return (
      <div className="reset-password-form" role="status">
        <TextZbl tag="h2" color="yellow" className="reset-password-form__title">
          Lien envoyé
        </TextZbl>

        <TextZbl jetbrains color="grey" className="reset-password-form__tagline">
          Un lien de réinitialisation vient d’être envoyé à <strong>{email}</strong>.
        </TextZbl>
        <TextZbl jetbrains color="grey" className="reset-password-form__tagline">
          Vérifiez votre boîte mail (et vos spams).
        </TextZbl>

        <div className="reset-password-form__footer">
          <Link href="/auth/login" className="reset-password-form__link">
            <TextZbl color="grey" jetbrains>
              ← Retour à la page de connexion
            </TextZbl>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="reset-password-form"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const validationError = validate(email);
        if (validationError) {
          setClientError(validationError);
          return;
        }
        setClientError(null);
        const result = await requestReset({ email });
        if (result.ok) setSubmitted(true);
      }}
    >
      <TextZbl tag="h2" color="yellow" className="reset-password-form__title">
        Mot de passe oublié
      </TextZbl>

      <div className="reset-password-form__fields">
        <FormInput
          id="email"
          name="email"
          type="email"
          className="formInput__field reset-password-form__input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
        >
          <TextZbl color="white" tag="h3">
            Email
          </TextZbl>
        </FormInput>
      </div>

      {displayedError && (
        <TextZbl color="red" jetbrains role="alert">
          {displayedError}
        </TextZbl>
      )}

      <ButtonZbl
        type="submit"
        theme="light"
        className="reset-password-form__submit"
        disabled={loading}
      >
        <TextZbl color="black" jetbrains>
          {loading ? 'Envoi…' : 'Envoyer le lien'}
        </TextZbl>
      </ButtonZbl>

      <div className="reset-password-form__footer">
        <Link href="/auth/login" className="reset-password-form__link">
          <TextZbl color="grey" jetbrains>
            ← Retour à la page de connexion
          </TextZbl>
        </Link>
      </div>
    </form>
  );
}
