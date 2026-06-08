import TextZbl from '@components/ui/textZbl/TextZbl';
import '@styles/loading.scss';

export default function Loading() {
  return (
    <div className="zbl_loading">
      <div className="zbl_loading_content">
        <TextZbl redPrefix="//">system_boot</TextZbl>
        <TextZbl tag="h1">ZOMBIE LAND</TextZbl>
        <TextZbl className="zbl_loading_status">Analyse de la zone infectée en cours...</TextZbl>
        <div className="zbl_loading_bar">
          <div className="zbl_loading_bar_fill" />
        </div>
      </div>
    </div>
  );
}
