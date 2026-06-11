'use client';
import { user } from '@prismaInstance/*';
import { fetchWithAuth } from '@shared/fetchWithAuth';
import { useCallback } from 'react';

type UpdatePasswordResult = { ok: boolean; message?: string; error?: string };
type UpdatePasswordBody = Pick<user, 'password'> & { confirmPassword: string; oldPassword: string };

export const useUpdatePassword = () =>
  useCallback(async (body: UpdatePasswordBody): Promise<UpdatePasswordResult> => {
    try {
      const res = await fetchWithAuth('/api/user/me/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const json = await res.json();

      if (!res.ok) {
        const message = json?.error || `Error ${res.status}`;
        return { ok: false, error: message };
      }

      return { ok: true, message: json.message };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error server';
      return { ok: false, error: message };
    } finally {
    }
  }, []);
