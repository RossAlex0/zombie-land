'use client';
import React from 'react';

type ResetPasswordBody = { email: string };
type ResetPasswordResponse = { message: string };
type ResetPasswordResult = { ok: true; data: ResetPasswordResponse } | { ok: false; error: string };

export default function useResetPassword() {
  const [data, setData] = React.useState<ResetPasswordResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const requestReset = async (body: ResetPasswordBody): Promise<ResetPasswordResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/user/reset-password', {
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

  return { requestReset, data, loading, error };
}
