import InfectLogo from '@components/ui/infect-logo/InfectLogo';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import FooterNav from './FooterNav';
import './footer.scss';

export default function Footer() {
  return (
    <section className="footer">
      <div className="footer_info">
        <div className="footer_info_logo">
          <InfectLogo />
          <TextZbl>
            Le dernier parc d’attractions encore ouvert après l’effondrement nucléaire mais aussi le
            foyer de la contamination où le patient 0 fut découvert
          </TextZbl>
        </div>
        <div className="footer_info_nav">
          <FooterNav
            title="Parc"
            links={[
              { label: 'Attractions', href: '/activity' },
              { label: 'Réservation', href: '/booking' },
              { label: 'Infos Pratiques', href: '/info' },
            ]}
          />
        </div>
        <div className="footer_info_nav">
          <FooterNav
            title="Informations Legales"
            links={[
              { label: 'Politique de confidentialité', href: '/privacy-policy' },
              { label: 'Notice légale', href: '/legal-notice' },
            ]}
          />
        </div>
        <div className="footer_info_nav">
          <FooterNav
            title="Contact"
            links={[
              { label: 'support@zombieland.com', href: 'mailto:support@zombieland.com' },
              { label: '0552435263', href: 'tel:+33552435263' },
              {
                label: 'I2 rue de la terreur, Toulouse 31000',
                href: 'https://maps.google.com/?q=12+rue+de+la+terreur+Toulouse+31000',
              },
            ]}
          />
        </div>
      </div>
      <p className="footer_title">ZOMBIE LAND</p>
    </section>
  );
}
