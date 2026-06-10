'use client';
import React from 'react';

type UpdatePasswordBody = {
  oldPassword: string;
  newPassword: string;
  newConfirmPassword: string;
};
type UpdatePasswordResponse = { message: string };
type UpdatePasswordResult =
  | { ok: true; data: UpdatePasswordResponse }
  | { ok: false; error: string };

export default function useUpdatePassword() {
  const [data, setData] = React.useState<UpdatePasswordResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const updatePassword = async (body: UpdatePasswordBody): Promise<UpdatePasswordResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/user/me', {
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
  return { updatePassword, data, loading, error };
}
