'use client';

import { fetchWithAuth } from '@shared/fetchWithAuth';
import { useState, useEffect } from 'react';

const cache = new Map<string, unknown>();

export function clearCache(url: string) {
  cache.delete(url);
}

export default function useFetch<T>(url: string | null, forceRefresh = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url || (!forceRefresh && cache.has(url))) {
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchWithAuth(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        cache.set(url, result.data);
        setData(result.data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [forceRefresh, url]);

  if (!forceRefresh && url && cache.has(url)) {
    return { data: cache.get(url) as T, loading: false, error };
  }

  return { data, loading, error };
}
