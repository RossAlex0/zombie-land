'use client';
import styles from './sidebar.module.scss';

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
  return (
    <nav className={styles.sidebar__nav}>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
