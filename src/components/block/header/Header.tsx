'use client';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import InfectLogo from '@components/ui/infect-logo/InfectLogo';
import { useAuth } from '@context/authProvider';
import { PUBLIC_NAV_ITEMS, PROFILE_NAV_ITEM } from './navItems';
import './header.scss';

export default function Header() {
  const { user, loading } = useAuth();

  const navigationNames = user ? [...PUBLIC_NAV_ITEMS, PROFILE_NAV_ITEM] : PUBLIC_NAV_ITEMS;

  return (
    <header className="header">
      <InfectLogo />
      {!loading ? (
        <div className={`header_link ${user ? 'link_end' : 'link_between'}`}>
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
