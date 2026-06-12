'use client';
import React, { useCallback } from 'react';

export default function useCeateCheckoutSession() {
  const [loading, setLoading] = React.useState(false);

  // {
  //   "from": "2026-07-15T00:00:00.000Z",
  //   "to": "2026-07-15T00:00:00.000Z",
  //   "tickets": [
  //     {
  //       "category_id": 1,
  //       "quantity": 2
  //     },
  //     {
  //       "category_id": 2,
  //       "quantity": 2
  //     }
  //   ]
  // }

  const session = useCallback(async (bookingId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/checkout/`, {
        method: 'POST',
        body: JSON.stringify({
          bookingId,
          //Line-items,
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        const message = json?.error || `Erreur ${res.status}`;
        return { ok: false, error: message };
      }

      return { ok: true, redirect: json.checkoutUrl as string };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur réseau';
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { session, loading };
}
