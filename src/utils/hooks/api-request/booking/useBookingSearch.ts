'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@shared/fetchWithAuth';
import type { IBookingBO } from '@customTypes/collections/booking';

type PaginatedBookings = {
  data: IBookingBO[];
  total: number;
  page: number;
  limit: number;
};

// Paginated fetch of bookings: the state (search, status, page) lives in the URL,
// the hook only requests `/api/booking` with the received query string.
export function useBookingSearch(queryString: string) {
  const [result, setResult] = useState<PaginatedBookings>({
    data: [],
    total: 0,
    page: 1,
    limit: 20,
  });
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
        const res = await fetchWithAuth(`/api/booking?${queryString}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: PaginatedBookings = await res.json();
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
    bookings: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
    loading,
    initialLoading: loading && !hasLoaded,
    error,
    refresh,
  };
}
