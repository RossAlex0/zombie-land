import { Home, RollerCoaster, CalendarDays, NotepadText, User, Lock } from 'lucide-react';
import type { ReactNode } from 'react';

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', href: '/', icon: <Home size={28} /> },
  { label: 'Activités', href: '/activity', icon: <RollerCoaster size={28} /> },
  { label: 'Réservation', href: '/booking', icon: <CalendarDays size={28} /> },
  { label: 'Manuel de survie', href: '/info', icon: <NotepadText size={28} /> },
];

export const PROFILE_NAV_ITEM: NavItem = {
  label: 'Profil',
  href: '/account',
  icon: <User size={28} />,
};

export const LOGIN_NAV_ITEM: NavItem = {
  label: 'Se connecter',
  href: '/auth/login',
  icon: <Lock size={28} />,
};
