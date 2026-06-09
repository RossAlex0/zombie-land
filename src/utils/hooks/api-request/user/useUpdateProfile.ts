'use client';
import React from 'react';

type UpdateProfileBody = {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
};
type UpdateProfileResponse = { message: string };
type UpdateProfileResult = { ok: true; data: UpdateProfileResponse } | { ok: false; error: string };

export default function useUpdateProfile() {
  const [data, setData] = React.useState<UpdateProfileResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const updateProfile = async (body: UpdateProfileBody): Promise<UpdateProfileResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/user/me', {
        method: 'PUT',
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

  return { updateProfile, data, loading, error };
}
