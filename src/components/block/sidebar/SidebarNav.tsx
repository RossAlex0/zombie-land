'use client';
import './sidebar.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Accueil', href: '/admin/back-office' },
  { label: 'Activitées', href: '/admin/back-office/activities' },
  { label: 'Catégories', href: '/admin/back-office/categories' },
  { label: 'Utilisateurs', href: '/admin/back-office/users' },
  { label: 'Réservations', href: '' },
  { label: 'Ticket', href: '' },
  { label: 'Réduction prix', href: '' },
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
