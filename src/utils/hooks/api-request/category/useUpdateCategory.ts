'use client';
import React from 'react';
import {
  CategoryMinAggregateInputType,
  categoryUpdateInput,
} from '../../../../../prisma/generated/models';
import { fetchWithAuth } from '@shared/fetchWithAuth';

type CategoryResponse = { id: number; email: string };
type CategoryResult = { ok: boolean; data: CategoryResponse[] } | { error: string };

export default function useUpdateCategory(id: number) {
  const [data, setData] = React.useState<CategoryMinAggregateInputType | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const category = async (body: categoryUpdateInput): Promise<CategoryResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`/api/category/${id}`, {
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

  return { category, data, loading, error };
}
