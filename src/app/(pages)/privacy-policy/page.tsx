import TextZbl from '@components/ui/text-zbl/TextZbl';
import '../legal-notice/legalDocument.scss';

export default function PrivacyPolicyPage() {
  return (
    <section className="legal_doc">
      <div className="legal_doc_header">
        <TextZbl jetbrains redPrefix="//">
          document_officiel - confidentialité
        </TextZbl>
        <div className="legal_doc_header_title">
          <TextZbl tag="h1">POLITIQUE DE</TextZbl>
          <TextZbl tag="h1" color="red">
            &nbsp;CONFIDENTIALITÉ
          </TextZbl>
        </div>
        <TextZbl jetbrains color="grey">
          Dernière mise à jour : juin 2026
        </TextZbl>
      </div>

      <div className="legal_doc_body">
        <article className="legal_doc_body_section">
          <TextZbl>
            Zombie Land SAS attache une grande importance à la protection de vos données
            personnelles. Cette politique explique quelles données nous collectons, pourquoi, et
            quels sont vos droits, conformément au Règlement Général sur la Protection des Données
            (RGPD).
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="01">
            Données collectées
          </TextZbl>
          <TextZbl>
            Lors de la création d&apos;un compte ou d&apos;une réservation, nous collectons : nom,
            prénom, adresse e-mail, date de naissance et les informations nécessaires à la gestion
            de vos billets. Votre mot de passe est stocké sous forme chiffrée et n&apos;est jamais
            accessible en clair.
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="02">
            Finalités du traitement
          </TextZbl>
          <TextZbl>
            Vos données sont utilisées pour gérer votre compte, traiter vos réservations, assurer
            votre accès au parc et vous contacter en cas de besoin lié à votre visite. Elles ne sont
            jamais revendues à des tiers.
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="03">
            Durée de conservation
          </TextZbl>
          <TextZbl>
            Vos données sont conservées le temps de l&apos;existence de votre compte, puis
            anonymisées à la suppression de celui-ci. Les données liées aux transactions sont
            conservées conformément aux obligations légales comptables.
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="04">
            Cookies
          </TextZbl>
          <TextZbl>
            Le site utilise des cookies strictement nécessaires à son fonctionnement, notamment pour
            la gestion de votre session d&apos;authentification. Ces cookies ne servent pas à des
            fins publicitaires.
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="05">
            Vos droits
          </TextZbl>
          <TextZbl>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
            d&apos;effacement, de limitation et de portabilité de vos données. Vous pouvez exercer
            ces droits à tout moment depuis votre espace personnel ou en nous contactant à
            support@zombieland.com.
          </TextZbl>
        </article>

        <article className="legal_doc_body_section">
          <TextZbl tag="h2" redPrefix="06">
            Contact
          </TextZbl>
          <TextZbl>
            Pour toute question relative à vos données personnelles, écrivez-nous à
            support@zombieland.com. Vous pouvez également introduire une réclamation auprès de la
            CNIL.
          </TextZbl>
        </article>
      </div>
    </section>
  );
}
