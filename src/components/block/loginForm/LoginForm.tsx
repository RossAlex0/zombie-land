'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import useMutation from '@hooks/api-request/useMutation';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import FormInput from '@components/ui/FormInput/FormInput';
import './loginForm.scss';

type LoginBody = { email: string; password: string };
type LoginResponse = { id: number; email: string };

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { mutate, loading, error } = useMutation<LoginBody, LoginResponse>('/api/login');

  const redirectParam = searchParams.get('redirect');
  const redirectTo = redirectParam?.startsWith('/') ? redirectParam : '/';

  return (
    <form
      className="login-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const result = await mutate({ email, password });
        if (result.ok) {
          router.push(redirectTo);
          router.refresh();
        }
      }}
    >
      <TextZbl tag="h2" color="yellow" className="login-form__title">
        Connexion
      </TextZbl>

      <TextZbl tag="p" jetbrains color="grey">
        Survivez aux attractions. Fuyez les zombies. Gagnez votre ticket de sortie
      </TextZbl>

      <FormInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        autoComplete="email"
        required
      />

      <FormInput
        id="password"
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        autoComplete="current-password"
        required
      />

      {error && (
        <TextZbl tag="p" color="red" jetbrains role="alert">
          {error}
        </TextZbl>
      )}

      <ButtonZbl type="submit" className="login-form__submit" disabled={loading}>
        <TextZbl tag="p" color="yellow" jetbrains>
          {loading ? 'Connexion…' : 'Se connecter'}
        </TextZbl>
      </ButtonZbl>

      <Link href="/reset-password" className="login-form__link">
        <TextZbl tag="p" color="grey" jetbrains>
          Mot de passe oublié ?
        </TextZbl>
      </Link>

      <Link href="/sign-up" className="login-form__link">
        <TextZbl tag="p" color="grey" jetbrains>
          Pas encore de compte ? S&apos;inscrire
        </TextZbl>
      </Link>
    </form>
  );
}
