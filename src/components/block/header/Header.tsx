import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import TextZbl from '@components/ui/textZbl/TextZbl';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import './header.scss';

export default function Header() {
  const navigationNames = [
    { label: 'Accueil', href: '/' },
    { label: 'Activités', href: '/' },
    { label: 'Reservations', href: '/' },
    { label: 'Manuel de survie', href: '/' },
  ];
  return (
    <header className="header">
      <div className="header_logo">
        <div className="header_logo_image">
          <Image fill src={'/icons/logo.svg'} alt="Montagne russe zombie" loading="eager" />
        </div>
        <div>
          <TextZbl tag="h1" color="none" className="header_title">
            ZOMBIE LAND
          </TextZbl>
          <TextZbl jetbrains redPrefix="//">
            Zone_infecté_001
          </TextZbl>
        </div>
      </div>
      <div className="header_link">
        <nav className="header_link_nav">
          {navigationNames.map((nav, index) => (
            <Link key={nav.label} href={nav.href} className="header_link_nav_text">
              <TextZbl redPrefix={`0${index + 1}`}>{nav.label}</TextZbl>
            </Link>
          ))}
        </nav>
        <ButtonZbl theme="dark">
          <Lock size={16} color="#e5bf00" />
          <TextZbl tag="p" color="yellow" jetbrains>
            Se connecter
          </TextZbl>
        </ButtonZbl>
      </div>
    </header>
  );
}
