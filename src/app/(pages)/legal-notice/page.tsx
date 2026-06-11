import TextZbl from '@components/ui/text-zbl/TextZbl';
import './legalDocument.scss';

export default function LegalNoticePage() {
  return (
    <section className="legal_doc">
      <div className="legal_doc_header">
        <TextZbl jetbrains redPrefix="//">
          document_officiel - mentions_légales
        </TextZbl>
        <div className="legal_doc_header_title">
          <TextZbl tag="h1">MENTIONS</TextZbl>
          <TextZbl tag="h1" color="red">
            &nbsp;LÉGALES
          </TextZbl>
        </div>
        <TextZbl jetbrains color="grey">
          Dernière mise à jour : juin 2026
        </TextZbl>
      </div>
      <div className="legal_doc_body">
        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="01">
            Éditeur du site
          </TextZbl>
          <TextZbl>Siège social : 2 rue de la terreur, 31000 Toulouse, France.</TextZbl>
          <TextZbl>Adresse e-mail : support@zombieland.com — Téléphone : 05 52 43 52 63.</TextZbl>
          <TextZbl>Directeur de la publication : Ludivine, Alex , Ariel , Hervé.</TextZbl>
        </article>
        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="02">
            Hébergement
          </TextZbl>
          <TextZbl>
            Le site est hébergé par Vercel Inc., dont le siège social est situé au 440 N Barranca
            Ave #4133, Covina, CA 91723, États-Unis.
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="03">
            Propriété intellectuelle
          </TextZbl>
          <TextZbl>
            L&apos;ensemble des contenus présents sur le site (textes, images, logos, éléments
            graphiques, structure) est la propriété exclusive de Zombie Land SAS, sauf mention
            contraire. Toute reproduction, représentation ou diffusion, totale ou partielle, sans
            autorisation préalable est interdite et constitue une contrefaçon.
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="04">
            Responsabilité
          </TextZbl>
          <TextZbl>
            Zombie Land SAS s&apos;efforce d&apos;assurer l&apos;exactitude des informations
            diffusées sur le site, mais ne saurait être tenue responsable des erreurs, omissions ou
            indisponibilités. L&apos;accès aux attractions du parc reste soumis aux conditions de
            sécurité affichées sur place.
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="05">
            Liens hypertextes
          </TextZbl>
          <TextZbl>
            Le site peut contenir des liens vers des sites tiers. Zombie Land SAS n&apos;exerce
            aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="06">
            Droit applicable
          </TextZbl>
          <TextZbl>
            Les présentes mentions légales sont régies par le droit français. Tout litige relatif à
            leur application relève de la compétence des tribunaux de Toulouse.
          </TextZbl>
        </article>
      </div>
    </section>
  );
}
