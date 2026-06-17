'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@shared/fetchWithAuth';
import type { IUserBO } from '@customTypes/collections/user';

type PaginatedUsers = {
  data: IUserBO[];
  total: number;
  page: number;
  limit: number;
};

// Fetch paginé des utilisateurs : l'état (search, role, page) vit dans l'URL,
// le hook ne fait que requêter `/api/user` avec la query string reçue.
export function useUserSearch(queryString: string) {
  const [result, setResult] = useState<PaginatedUsers>({ data: [], total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth(`/api/user?${queryString}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: PaginatedUsers = await res.json();
        setResult(json);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [queryString, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return {
    users: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
    loading,
    initialLoading: loading && !hasLoaded,
    error,
    refresh,
  };
}
