'use client';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './authLayout.scss';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <main className="auth_main">
      <section className="auth_main_content">
        <div className="auth_main_content_header">
          <span className="auth_main_content_header_span">
            <TextZbl jetbrains redPrefix="//">
              Zone_infectée_001&nbsp;&nbsp;
            </TextZbl>
            <TextZbl jetbrains redPrefix="//">
              Foyer_012
            </TextZbl>
          </span>
          <TextZbl jetbrains redPrefix="//">
            Formulaire_accès_142
          </TextZbl>
          <div className="auth_main_logo">
            <div className="auth_main_logo_image" onClick={() => router.push('/')}>
              <Image fill src={'/icons/logo.svg'} alt="Montagne russe zombie" loading="eager" />
            </div>
            <div className="auth_main_logo_text">
              <TextZbl tag="h2" color="none" className="auth_main_title">
                ZOMBIE LAND
              </TextZbl>
              <TextZbl>
                Le dernier parc d’attractions encore ouvert après l’effondrement nucléaire !
              </TextZbl>
            </div>
          </div>
        </div>
        <div className="auth_main_body">{children}</div>
      </section>
    </main>
  );
}
