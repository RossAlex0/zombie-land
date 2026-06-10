'use client';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import TextZbl from '@components/ui/textZbl/TextZbl';
import { Lock } from 'lucide-react';
import Link from 'next/link';

import './header.scss';
import InfectLogo from '@components/ui/infectLogo/InfectLogo';
import { useAuth } from '@context/authProvider';

export default function Header() {
  const { user, loading } = useAuth();

  const navigationNames = [
    { label: 'Accueil', href: '/' },
    { label: 'Activités', href: '/activity' },
    { label: 'Reservations', href: '/' },
    { label: 'Manuel de survie', href: '/info' },
  ];

  if (user) navigationNames.push({ label: 'Profile', href: '/profile' });

  return (
    <header className="header">
      <InfectLogo />
      {!loading ? (
        <div className="header_link">
          <nav className="header_link_nav">
            {navigationNames.map((nav, index) => (
              <Link key={nav.label} href={nav.href} className="header_link_nav_text">
                <TextZbl jetbrains redPrefix={`0${index + 1}`}>
                  {nav.label}
                </TextZbl>
              </Link>
            ))}
          </nav>
          {!user ? (
            <ButtonZbl theme="dark" navTo="/auth/login">
              <Lock size={16} color="#e5bf00" />
              <TextZbl tag="p" color="yellow" jetbrains>
                Se connecter
              </TextZbl>
            </ButtonZbl>
          ) : undefined}
        </div>
      ) : undefined}
    </header>
  );
}
