'use client';

import { fetchWithAuth } from '@shared/fetchWithAuth';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: { id: number; name: string };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMe = async () => {
      try {
        const res = await fetchWithAuth('/api/user/me', { signal: controller.signal });
        if (res.ok) {
          const json = await res.json();

          setUser(json ?? null);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
    return () => controller.abort();
  }, []);

  return <AuthContext.Provider value={{ user, loading, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider');
  }
  return context;
}
