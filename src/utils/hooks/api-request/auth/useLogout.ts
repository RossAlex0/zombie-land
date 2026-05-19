// src/utils/hooks/api-request/useLogout.ts
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export default function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();
  //   const { clearUser } = useAuth();
  // Fn() pour nettoyer le contexte React

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // envoie les cookies (access_token + refresh_token)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Vider le context React
      //   clearUser();

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { logout, loading, error };
}
