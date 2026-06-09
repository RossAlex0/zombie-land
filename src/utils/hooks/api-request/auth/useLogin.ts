'use client';
import { useAuth } from '@context/authProvider';
import React from 'react';

type LoginBody = { email: string; password: string };
type LoginResponse = { id: number; email: string };
type LoginResult = { ok: true; data: LoginResponse } | { ok: false; error: string };

export default function useLogin() {
  const { setUser } = useAuth();
  const [data, setData] = React.useState<LoginResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const login = async (body: LoginBody): Promise<LoginResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/login', {
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
      setUser(json.user);
      return { ok: true, data: json };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur réseau';
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { login, data, loading, error };
}
