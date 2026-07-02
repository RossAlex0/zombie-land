import type { Metadata } from 'next';
import { Bebas_Neue, Liter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@context/authProvider';

import '../utils/styles/globals.scss';

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  subsets: ['latin'],
  weight: '400',
});

const liter = Liter({
  variable: '--font-liter',
  subsets: ['latin'],
  weight: '400',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const siteDescription =
  "Zombieland est un parc d'attractions sur le thème des zombies, offrant une expérience immersive et effrayante.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.FRONT_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Zombieland',
    template: '%s | Zombieland',
  },
  description: siteDescription,
  applicationName: 'Zombieland',
  keywords: ['Zombieland', 'parc', 'attractions', 'zombies', 'réservation', 'survie'],
  authors: [{ name: 'Zombieland' }],
  icons: {
    icon: '/icons/logo.svg',
  },
  openGraph: {
    title: 'Zombieland',
    description: siteDescription,
    siteName: 'Zombieland',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: '/images/default-activity.webp',
        width: 1200,
        height: 630,
        alt: 'Zombieland',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zombieland',
    description: siteDescription,
    images: ['/images/default-activity.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${bebasNeue.variable} ${liter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
