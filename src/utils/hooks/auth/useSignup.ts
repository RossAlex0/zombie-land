import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import type { IUserSignup } from '../../types/User';

export default function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  const signup = useCallback(
    async (signupFormData: IUserSignup) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/signup', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(signupFormData),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        router.push('/');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [router]
  );
  return { signup, loading, error };
}
