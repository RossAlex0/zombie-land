'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@context/authProvider';
import { PUBLIC_NAV_ITEMS, PROFILE_NAV_ITEM, LOGIN_NAV_ITEM } from './navItems';
import './headerMobile.scss';

export default function HeaderMobile() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;

  const items = [...PUBLIC_NAV_ITEMS, user ? PROFILE_NAV_ITEM : LOGIN_NAV_ITEM];

  return (
    <nav className="header_mobile" aria-label="Navigation principale">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-label={item.label}
          className={`header_mobile_link ${pathname === item.href ? 'active' : ''}`}
        >
          {item.icon}
        </Link>
      ))}
    </nav>
  );
}
