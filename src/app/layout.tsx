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

export const metadata: Metadata = {
  title: 'Zombieland',
  description:
    "Zombieland est un parc d'attractions sur le thème des zombies, offrant une expérience immersive et effrayante.",
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
