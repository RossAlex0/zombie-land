'use client';
import DropDownZbl from '@components/ui/drop-down-zbl/DropDownZbl';
import { FilterPeriod } from '@customTypes/enum/filterPeriod';
import { useState } from 'react';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ContentBackOffice from '@components/layout/content-back-office/ContentBackoffice';
import './backoffice.scss';

export default function Home() {
  const [period, setPeriod] = useState<string>(FilterPeriod.TODAY);

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Dashboard globale</TextZbl>
          </div>
          {/* conditions if not accueil and get nb items */}
          <div className="backoffice_content_header_title_items yellow">
            <TextZbl jetbrains color="yellow">
              14 items
            </TextZbl>
          </div>
        </div>
        <DropDownZbl
          options={[
            { label: "Aujourd'hui", value: FilterPeriod.TODAY },
            { label: 'Dernière semaine', value: FilterPeriod.LAST_WEEK },
            { label: 'Mois dernier', value: FilterPeriod.LAST_MONTH },
          ]}
          value={period}
          onChange={(opt) => setPeriod(opt.value)}
        />
      </div>
      <ContentBackOffice />
    </div>
  );
}
