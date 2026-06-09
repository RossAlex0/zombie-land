'use client';
import React from 'react';

type ActivityCreatePayload = {
  name: string;
  description?: string;
  status?: string;
  picture?: string;
  category_activity?: { category_id: number }[];
};

type ActivityResponse = { id: number };
type ActivityResult = { ok: boolean; data: ActivityResponse } | { error: string };

export default function useCreateActivity() {
  const [data, setData] = React.useState<ActivityResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const activity = async (body: ActivityCreatePayload): Promise<ActivityResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/activity`, {
        method: 'POST',
        body: JSON.stringify(body),
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
      return { ok: true, data: json };
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
