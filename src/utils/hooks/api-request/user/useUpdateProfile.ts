'use client';
import { UserWithRoleAndBooking } from '@customTypes/collections/user';
import { user } from '@prismaInstance/*';
import { fetchWithAuth } from '@shared/fetchWithAuth';
import { useCallback } from 'react';

type UpdateProfileResult = {
  ok: boolean;
  data?: UserWithRoleAndBooking;
  error?: string;
  message?: string;
};

export const useUpdateProfile = () =>
  useCallback(async (body: Partial<user>): Promise<UpdateProfileResult> => {
    try {
      const res = await fetchWithAuth('/api/user/me', {
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

      return { ok: true, data: json.data, message: json.message };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error server';
      return { ok: false, error: message };
    }
  }, []);
