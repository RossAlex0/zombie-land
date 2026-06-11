'use client';
import React from 'react';

type ConfigurationBody = {
  entry_price?: number;
  capacity?: number;
  status?: string;
  opening_hours?: string;
  closing_hours?: string;
};

type ConfigurationResponse = {
  id: number;
  entry_price: number;
  capacity: number;
  status: string;
  opening_hours: string;
  closing_hours: string;
};

type ConfigurationResult = { ok: true; data: ConfigurationResponse } | { ok: false; error: string };

export default function usePatchConfiguration() {
  const [data, setData] = React.useState<ConfigurationResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const configuration = async (body: ConfigurationBody): Promise<ConfigurationResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/configuration', {
        method: 'PATCH',
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
      setData(json.data);
      return { ok: true, data: json.data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur réseau';
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { configuration, data, loading, error };
}
