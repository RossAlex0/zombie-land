'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Sidebar from '@components/block/sidebar/Sidebar';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import './adminLayout.scss';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <div className="admin-layout__mobile-header">
        <button
          className="admin-layout__hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} color="#828282" />
        </button>
        <div className="admin-layout__mobile-logo">
          <div className="admin-layout__mobile-logo-image">
            <Image fill src="/icons/logo.svg" alt="Zombie Land logo" loading="lazy" />
          </div>
          <div>
            <TextZbl tag="h1" color="none" className="admin-layout__mobile-title">
              ZOMBIE LAND
            </TextZbl>
          </div>
        </div>
      </div>

      <div className={`admin-layout__sidebar ${sidebarOpen ? 'admin-layout__sidebar--open' : ''}`}>
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="admin-layout__overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="admin-layout__content">{children}</main>
    </div>
  );
}
