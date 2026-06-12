'use client';
import { configuration } from '@prismaInstance/*';
import React, { useCallback } from 'react';

type ConfigurationResult = { ok: boolean; data?: configuration; error?: string };

export default function usePatchConfiguration() {
  const [loading, setLoading] = React.useState(false);

  const patchConfiguration = useCallback(
    async (body: Partial<configuration>): Promise<ConfigurationResult> => {
      setLoading(true);
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
          return { ok: false, error: message };
        }
        return { ok: true, data: json.data };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur réseau';
        return { ok: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { patchConfiguration, loading };
}
