'use client';

import useFetch from '@hooks/api-request/useFetch';
import { Clock, Users, Ticket, ShieldAlert, FileWarning, Lock } from 'lucide-react';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import Loading from '../../loading';
import { configuration } from '@prismaInstance/*';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import './info.scss';

export default function InformationPage() {
  const { data, loading, error } = useFetch<configuration>('/api/configuration');

  if (loading) return <Loading />;

  if (error) {
    throw new Error('Erreur durant la récupération des informations du parc ( /information )');
  }

  const isOpen = data?.status === 'active';

  return (
    <section className="info">
      <div className="info_header">
        <div className="info_header_title">
          <TextZbl tag="h1">PROTOCOLE</TextZbl>
          <TextZbl tag="h1" color="red">
            &nbsp;DE SURVIE
          </TextZbl>
        </div>
        <TextZbl jetbrains color="grey">
          Lisez attentivement avant d&apos;entrer dans la zone. Le non-respect des consignes
          n&apos;engage que votre survie.
        </TextZbl>
      </div>
      <div className={`info_status ${isOpen ? 'info_status_open' : 'info_status_closed'}`}>
        <span className="info_status_dot" />
        <TextZbl jetbrains>
          {isOpen ? 'ZONE ACCESSIBLE — survivants admis' : 'ZONE CONDAMNÉE — accès suspendu'}
        </TextZbl>
      </div>
      <div className="info_grid">
        <div className="info_grid_card">
          <Clock size={20} color="#ac382a" />
          <TextZbl jetbrains color="grey" redPrefix="//">
            Fenêtre d&apos;accès
          </TextZbl>
          <TextZbl tag="h3">
            {String(data?.opening_hours)} — {String(data?.closing_hours)}
          </TextZbl>
          <TextZbl jetbrains color="grey">
            Toute présence hors de ces heures est laissée à la merci des zombies.
          </TextZbl>
        </div>

        <div className="info_grid_card">
          <Users size={20} color="#ac382a" />
          <TextZbl jetbrains color="grey" redPrefix="//">
            Capacité du refuge
          </TextZbl>
          <TextZbl tag="h3">{data?.capacity} survivants</TextZbl>
          <TextZbl jetbrains color="grey">
            Au-delà, les ressources ne sont plus garanties pour tous.
          </TextZbl>
        </div>

        <div className="info_grid_card">
          <Ticket size={20} color="#ac382a" />
          <TextZbl jetbrains color="grey" redPrefix="//">
            Droit d&apos;entrée
          </TextZbl>
          <TextZbl tag="h3">{String(data?.entry_price)} €</TextZbl>
          <TextZbl jetbrains color="grey">
            Le prix de l&apos;entrée. Par personne, non remboursable en cas de morsure.
          </TextZbl>
        </div>
      </div>
      <div className="info_rules">
        <TextZbl tag="h2">
          <ShieldAlert size={22} color="#ac382a" /> &nbsp;CONSIGNES DE ZONE
        </TextZbl>
        <ol className="info_rules_list">
          <li>
            <TextZbl>Restez en groupe. Un survivant isolé est un survivant condamné.</TextZbl>
          </li>
          <li>
            <TextZbl>
              Ne quittez jamais les sentiers balisés. Les zones non éclairées ne sont pas
              sécurisées.
            </TextZbl>
          </li>
          <li>
            <TextZbl>Signalez toute morsure immédiatement au personnel. La discrétion tue.</TextZbl>
          </li>
          <li>
            <TextZbl>
              Respectez les fenêtres d&apos;accès. Les portes se verrouillent à la fermeture.
            </TextZbl>
          </li>
        </ol>
      </div>
      <div className="info_legal">
        <TextZbl jetbrains color="grey" redPrefix="//">
          Documents officiels de la direction
        </TextZbl>
        <div className="info_legal_links">
          <ButtonZbl navTo="/legal-notice" theme="dark">
            <FileWarning size={16} color="#e5bf00" />
            <TextZbl jetbrains color="yellow">
              Mentions légales
            </TextZbl>
          </ButtonZbl>
          <ButtonZbl navTo="/privacy-policy" theme="dark">
            <Lock size={16} color="#e5bf00" />
            <TextZbl jetbrains color="yellow">
              Politique de confidentialité
            </TextZbl>
          </ButtonZbl>
        </div>
      </div>
    </section>
  );
}
