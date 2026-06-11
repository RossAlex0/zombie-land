'use client';
import React from 'react';
import { RoleName } from '@customTypes/enum/roles';
import { fetchWithAuth } from '@shared/fetchWithAuth';

type UpdateRoleBody = { role: RoleName };
type UpdateRoleResponse = { message: string };
type UpdateRoleResult = { ok: true; data: UpdateRoleResponse } | { ok: false; error: string };

export default function useUpdateUserRole() {
  const [data, setData] = React.useState<UpdateRoleResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const updateUserRole = async (
    userId: number,
    body: UpdateRoleBody
  ): Promise<UpdateRoleResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`/api/user/${userId}`, {
        method: 'PATCH',
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

  return { updateUserRole, data, loading, error };
}
