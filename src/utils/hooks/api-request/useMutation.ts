'use client';
import React from 'react';

type MutationResult<TData> = { ok: true; data: TData } | { ok: false; error: string };

export default function useMutation<TBody, TData>(url: string) {
  const [data, setData] = React.useState<TData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const mutate = async (body: TBody): Promise<MutationResult<TData>> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        const message = json?.error || `Erreur ${res.status}`;
        setError(message);
        return { ok: false, error: message };
      }
      setData(json);
      return { ok: true, data: json };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur réseau';
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}
