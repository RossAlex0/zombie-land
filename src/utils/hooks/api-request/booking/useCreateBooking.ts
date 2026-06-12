'use client';
import { BookingCreatePayload, BookingWithTickets } from '@customTypes/collections/booking';
import { format } from 'date-fns';
import { fetchWithAuth } from '@shared/fetchWithAuth';
import React, { useCallback } from 'react';

type BookingResult = { ok: boolean; data?: BookingWithTickets; error?: string };

export default function useCreateBooking() {
  const [loading, setLoading] = React.useState(false);

  const createBooking = useCallback(async (body: BookingCreatePayload): Promise<BookingResult> => {
    setLoading(true);

    if (body.from > body.to) {
      return { ok: false, error: 'Start date must be before end date' };
    }

    const payload = {
      ...body,
      from: format(body.from, 'yyyy-MM-dd'),
      to: format(body.to, 'yyyy-MM-dd'),
    };

    try {
      const res = await fetchWithAuth(`/api/booking/me`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
  }, []);

  return { createBooking, loading };
}
