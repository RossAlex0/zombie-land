'use client';
import './sidebar.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Accueil', href: '' },
  { label: 'Activitées', href: '' },
  { label: 'Catégories', href: '' },
  { label: 'Utilisateurs', href: '' },
  { label: 'Réservations', href: '' },
  { label: 'Roles', href: '' },
  { label: 'Ticket', href: '' },
  { label: 'Modificateur de prix', href: '' },
  { label: 'Refresh token', href: '' },
  { label: 'Configuration', href: '' },
];

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="sidebar__nav">
      <ul className="sidebar__nav_container">
        {links.map((link) => (
          <li
            key={link.label}
            className={`sidebar__nav_link ${pathname === link.href ? 'sidebar__nav_link--active' : ''}`}
          >
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
