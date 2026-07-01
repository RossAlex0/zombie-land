import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useAuth } from '@context/authProvider';
import { fetchWithAuth } from '@shared/fetchWithAuth';

export default function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();
  const { setUser } = useAuth();

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchWithAuth('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setUser(null);

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [router, setUser]);

  return { logout, loading, error };
}
