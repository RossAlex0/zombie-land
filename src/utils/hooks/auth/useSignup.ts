'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import type { IUserSignup } from '../../types/User';

type FieldErrors = Record<string, string>;
type SignupResult = { ok: true } | { ok: false; error: string };

export default function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const router = useRouter();

  const signup = useCallback(
    async (signupFormData: IUserSignup): Promise<SignupResult> => {
      setLoading(true);
      setError(null);
      setFieldErrors({});

      try {
        const res = await fetch('/api/signup', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(signupFormData),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          if (json?.errors) setFieldErrors(json.errors as FieldErrors);
          const message = json?.message || `Erreur ${res.status}`;
          setError(message);
          return { ok: false, error: message };
        }
        router.push('/auth/login');
        return { ok: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur réseau';
        setError(message);
        return { ok: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [router]
  );
  return { signup, loading, error, fieldErrors };
}
