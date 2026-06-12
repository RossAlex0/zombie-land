'use client';
import React from 'react';

export default function useCeateCheckoutSession() {
  const [data] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

  const session = async (bookingId: number) => {
    setLoading(true);
    setError(null);
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
        setError(message);
        return { ok: false, error: message };
      }
      window.location.href = json.checkoutUrl;

      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur réseau';
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { session, data, loading, error };
}
