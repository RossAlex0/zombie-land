import SidebarNav from './SidebarNav';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import TextZbl from '@components/ui/textZbl/TextZbl';
import './sidebar.scss';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo_image">
          <Image fill src={'/icons/logo.svg'} alt="Montagne russe zombie" loading="eager" />
        </div>
        <TextZbl tag="h1" color="none" className="sidebar__logo_title">
          ZOMBIE LAND
        </TextZbl>
      </div>
      <SidebarNav />
      <ButtonZbl className="sidebar__button">
        <TextZbl tag="p" color="black" jetbrains>
          Retour au site
        </TextZbl>
      </ButtonZbl>
    </aside>
  );
}
