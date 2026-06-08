'use client';
import React from 'react';

type ActivityResult = { ok: boolean } | { error: string };

export default function useLogin(id: number) {
  const [data, setData] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const activity = async (): Promise<ActivityResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/activity/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        const message = json?.error || `Erreur ${res.status}`;
        setError(message);
        return { ok: false, error: message };
      }
      setData(json);
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur réseau';
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { activity, data, loading, error };
}
