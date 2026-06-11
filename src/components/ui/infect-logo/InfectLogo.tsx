import Image from 'next/image';
import TextZbl from '../text-zbl/TextZbl';

import './infectLogo.scss';

export default function InfectLogo() {
  return (
    <div className="infect_logo">
      <div className="infect_logo_image">
        <Image fill src={'/icons/logo.svg'} alt="Montagne russe zombie" loading="eager" />
      </div>
      <div>
        <TextZbl tag="h1" color="none" className="infect_logo_title">
          ZOMBIE LAND
        </TextZbl>
        <TextZbl jetbrains redPrefix="//">
          Zone_infecté_001
        </TextZbl>
      </div>
    </div>
  );
}
