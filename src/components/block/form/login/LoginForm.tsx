'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import useLogin from '@hooks/api-request/auth/useLogin';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import FormInput from '@components/ui/input/form-input/FormInput';
import './loginForm.scss';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login, loading, error } = useLogin();

  const redirectParam = searchParams.get('redirect');
  const redirectTo = redirectParam?.startsWith('/') ? redirectParam : '/';

  return (
    <form
      className="login-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const result = await login({ email, password });
        if (result.ok) {
          router.push(redirectTo);
          router.refresh();
        }
      }}
    >
      <div className="login-form__fields">
        <FormInput
          id="email"
          name="email"
          type="email"
          className="formInput__field login-form__input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
          required
        >
          <TextZbl color="white" tag="h3">
            Email
          </TextZbl>
        </FormInput>

        <FormInput
          id="password"
          name="password"
          type="password"
          className="formInput__field login-form__input"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
          required
        >
          <TextZbl color="white" tag="h3">
            Mot de passe
          </TextZbl>
        </FormInput>
      </div>

      <div className="login-form__actions">
        <TextZbl jetbrains color="grey" className="login-form__tagline">
          «&nbsp;Survivez aux attractions. Fuyez les zombies. Gagnez votre ticket de sortie&nbsp;»
        </TextZbl>

        {error && (
          <TextZbl color="red" jetbrains role="alert">
            {error}
          </TextZbl>
        )}

        <ButtonZbl type="submit" theme="light" className="login-form__submit" disabled={loading}>
          <TextZbl color="black" jetbrains>
            {loading ? 'Connexion…' : 'Se connecter'}
          </TextZbl>
          <svg
            className="login-form__submit-icon"
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ButtonZbl>

        <ButtonZbl
          type="button"
          theme="custom"
          className="login-form__google-btn"
          aria-label="Se connecter avec Google"
        >
          <TextZbl color="black" jetbrains>
            Se connecter
          </TextZbl>
          <svg
            className="login-form__google-icon"
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            />
          </svg>
        </ButtonZbl>
      </div>

      <div className="login-form__footer">
        <Link href="/auth/reset-password" className="login-form__forgot">
          <TextZbl color="grey" jetbrains>
            Mot de passe oublié ?
          </TextZbl>
        </Link>

        <Link href="/auth/sign-up" className="login-form__link">
          <TextZbl color="grey" jetbrains>
            Pas de compte ? <span className="login-form__link-accent">Créez un compte</span>
          </TextZbl>
        </Link>
      </div>
    </form>
  );
}
