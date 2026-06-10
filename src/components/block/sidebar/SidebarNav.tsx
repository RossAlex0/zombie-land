'use client';
import './sidebar.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, FerrisWheel, Tag, Users, CalendarDays, Ticket, HandCoins, Cog } from 'lucide-react';

const links = [
  { label: 'Accueil', href: '/admin/back-office', icon: House },
  { label: 'Activitées', href: '/admin/back-office/activities', icon: FerrisWheel },
  { label: 'Catégories', href: '/admin/back-office/categories', icon: Tag },
  { label: 'Utilisateurs', href: '/admin/back-office/users', icon: Users },
  { label: 'Réservations', href: '', icon: CalendarDays },
  { label: 'Ticket', href: '', icon: Ticket },
  { label: 'Réduction prix', href: '', icon: HandCoins },
  { label: 'Configuration', href: '', icon: Cog },
];

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="sidebar__nav">
      <ul className="sidebar__nav_container">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <li
              key={link.label}
              className={`sidebar__nav_link ${pathname === link.href ? 'sidebar__nav_link--active' : ''}`}
            >
              <Link href={link.href}>
                <Icon size={20} className="sidebar__nav_icon" />
                <span className="sidebar__nav_label">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
