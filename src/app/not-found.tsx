import '@styles/notFound.scss';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';

export default function NotFound() {
  return (
    <div className="zbl_404">
      <div className="zbl_404_content">
        <TextZbl jetbrains tag="h3" redPrefix="//">
          error_404 - zone_introuvable
        </TextZbl>
        <TextZbl tag="h1" jetbrains color="yellow" data-text="404">
          404
        </TextZbl>
        <TextZbl tag="h2" jetbrains color="red">
          ZONE DISPARUE
        </TextZbl>
        <TextZbl>
          Cette zone a été engloutie par la contamination. Aucune trace du secteur que vous
          cherchez.
        </TextZbl>
        <ButtonZbl navTo="/" theme="light">
          <TextZbl color="black">Retour en lieu sûr</TextZbl>
        </ButtonZbl>
      </div>
    </div>
  );
}
