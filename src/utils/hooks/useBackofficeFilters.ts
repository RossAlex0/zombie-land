'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Shared back-office list state. The URL is the source of truth so search,
 * filters and page survive navigation. The hook owns the debounced search input
 * and exposes a single `updateParams` helper (any filter change resets to page 1).
 *
 * `router` and `searchParams` are returned as well for the few flows that need
 * custom navigation (e.g. keeping the current page after a delete).
 */
export function useBackofficeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const urlSearch = searchParams.get('search') ?? '';

  // Local state only for typing: the input reacts immediately,
  // the URL is updated after the debounce.
  const [inputSearch, setInputSearch] = useState(urlSearch);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      // Any filter change resets to page 1
      if (!('page' in updates)) params.delete('page');
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (inputSearch === urlSearch) return;
    const timer = setTimeout(() => updateParams({ search: inputSearch }), 300);
    return () => clearTimeout(timer);
  }, [inputSearch, urlSearch, updateParams]);

  return { router, searchParams, page, urlSearch, inputSearch, setInputSearch, updateParams };
}
