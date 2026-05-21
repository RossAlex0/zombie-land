'use client';
import React from 'react';
import Link from 'next/link';
import TextZbl from '@components/ui/textZbl/TextZbl';
import useMutation from '@hooks/api-request/useMutation';
import './resetPasswordForm.scss';

type ResetPasswordBody = { email: string };
type ResetPasswordResponse = { message: string };

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
  const { mutate, loading, error } = useMutation<ResetPasswordBody, ResetPasswordResponse>(
    '/api/user/reset-password'
  );

  const displayedError = clientError ?? (error && friendlyError(error));

  return (
    <div className="reset-password-form">
      <TextZbl tag="h2" color="yellow" className="reset-password-form__title">
        Mot de passe oublié
      </TextZbl>

      {submitted ? (
        <div className="reset-password-form__success" role="status">
          <TextZbl tag="p">
            Un lien de réinitialisation vient d’être envoyé à <strong>{email}</strong>.
          </TextZbl>
          <TextZbl tag="p">Vérifiez votre boîte mail (et vos spams).</TextZbl>
          <Link href="/login" className="reset-password-form__link">
            <TextZbl tag="p" color="grey" jetbrains>
              ← Retour à la page de connexion
            </TextZbl>
          </Link>
        </div>
      ) : (
        <form
          className="reset-password-form__form"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const validationError = validate(email);
            if (validationError) {
              setClientError(validationError);
              return;
            }
            setClientError(null);
            const result = await mutate({ email });
            if (result.ok) setSubmitted(true);
          }}
        >
          <TextZbl tag="p" jetbrains redPrefix="---">
            Email
          </TextZbl>
          <input
            id="email"
            type="email"
            className="reset-password-form__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
          />

          {displayedError && (
            <TextZbl tag="p" color="red" jetbrains role="alert">
              {displayedError}
            </TextZbl>
          )}

          <button type="submit" className="reset-password-form__submit" disabled={loading}>
            <TextZbl tag="p" color="yellow" jetbrains>
              {loading ? 'Envoi…' : 'Envoyer le lien'}
            </TextZbl>
          </button>

          <Link href="/login" className="reset-password-form__link">
            <TextZbl tag="p" color="grey" jetbrains>
              ← Retour à la page de connexion
            </TextZbl>
          </Link>
        </form>
      )}
    </div>
  );
}
