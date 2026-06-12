'use client';
import { ActivityPayload } from '@customTypes/collections/activity';
import { buildFormData } from '@shared/buildFormData';
import { fetchWithAuth } from '@shared/fetchWithAuth';
import React, { useCallback } from 'react';

type ActivityResponse = { id: number };
type ActivityResult = { ok: true; data: ActivityResponse } | { ok: false; error: string };

export default function usePatchActivity(id: number) {
  const [loading, setLoading] = React.useState(false);

  const activity = useCallback(
    async (body: ActivityPayload): Promise<ActivityResult> => {
      setLoading(true);
      try {
        const formData = buildFormData(body);

        const res = await fetchWithAuth(`/api/activity/${id}`, {
          method: 'PATCH',
          body: formData,
        });

        const json = await res.json();
        if (!res.ok) {
          const message = json?.error || `Erreur ${res.status}`;
          return { ok: false, error: message };
        }
        return { ok: true, data: json.data ?? json };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur réseau';
        return { ok: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  return { activity, loading };
}
