'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import DropDownZbl from '@components/ui/dropDownZbl/DropDownZbl';
import BackOfficeField from '@components/ui/backOfficeField/BackOfficeField';
import FlashMessage from '@components/ui/flashMessage/FlashMessage';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import usePatchConfiguration from '@hooks/api-request/configuration/usePatchConfiguration';
import '../backoffice.scss';
import './configuration.scss';

type Configuration = {
  id: number;
  entry_price: number;
  capacity: number;
  status: string;
  opening_hours: string;
  closing_hours: string;
};

const statusOptions = [
  { value: 'active', label: 'active' },
  { value: 'inactive', label: 'inactive' },
  { value: 'maintenance', label: 'maintenance' },
];

type FormProps = {
  config: Configuration;
};

function ConfigurationForm({ config }: FormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(config.status);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { configuration: patchConfiguration, loading } = usePatchConfiguration();

  const handleSubmit = async (formData: FormData) => {
    setSubmitError(null);
    const entry_price = parseFloat((formData.get('entry_price') as string) ?? '');
    const capacity = parseInt((formData.get('capacity') as string) ?? '');
    const opening_hours = (formData.get('opening_hours') as string) ?? '';
    const closing_hours = (formData.get('closing_hours') as string) ?? '';

    if (isNaN(entry_price) || entry_price < 0) {
      setSubmitError('Le prix doit être un nombre positif.');
      return;
    }
    if (isNaN(capacity) || capacity < 1) {
      setSubmitError('La capacité doit être un entier positif.');
      return;
    }
    if (!opening_hours) {
      setSubmitError("L'heure d'ouverture est obligatoire.");
      return;
    }
    if (!closing_hours) {
      setSubmitError("L'heure de fermeture est obligatoire.");
      return;
    }
    if (opening_hours >= closing_hours) {
      setSubmitError("L'heure d'ouverture doit être avant l'heure de fermeture.");
      return;
    }

    const result = await patchConfiguration({
      entry_price,
      capacity,
      status,
      opening_hours,
      closing_hours,
    });
    if (result.ok) {
      clearCache('/api/configuration');
      router.push('/admin/back-office/configuration?success=updated&entity=Configuration');
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <form
      className="configuration-edit"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
    >
      <div className="configuration-edit__grid">
        <BackOfficeField label="Prix d'entrée (€)">
          <input
            className="backoffice-field__input"
            type="number"
            name="entry_price"
            min="0"
            step="0.01"
            defaultValue={config.entry_price}
          />
        </BackOfficeField>

        <BackOfficeField label="Capacité">
          <input
            className="backoffice-field__input"
            type="number"
            name="capacity"
            min="1"
            step="1"
            defaultValue={config.capacity}
          />
        </BackOfficeField>

        <BackOfficeField label="Heure d'ouverture">
          <input
            className="backoffice-field__input"
            type="time"
            name="opening_hours"
            defaultValue={config.opening_hours}
          />
        </BackOfficeField>

        <BackOfficeField label="Heure de fermeture">
          <input
            className="backoffice-field__input"
            type="time"
            name="closing_hours"
            defaultValue={config.closing_hours}
          />
        </BackOfficeField>

        <BackOfficeField label="Statut">
          <DropDownZbl
            options={statusOptions}
            value={status}
            onChange={(opt) => setStatus(opt.value)}
          />
        </BackOfficeField>
      </div>

      {submitError && (
        <TextZbl jetbrains color="yellow">
          Erreur : {submitError}
        </TextZbl>
      )}

      <div className="configuration-edit__footer">
        <ButtonZbl theme="light" navTo="/admin/back-office">
          Annuler
        </ButtonZbl>
        <ButtonZbl type="submit" theme="light">
          {loading ? 'Enregistrement...' : 'Valider'}
        </ButtonZbl>
      </div>
    </form>
  );
}

export default function ConfigurationPage() {
  const { data: config, loading, error } = useFetch<Configuration>('/api/configuration');

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Configuration</TextZbl>
          </div>
          {config && (
            <div className="backoffice_content_header_title_items yellow">
              <TextZbl jetbrains color="yellow">
                {config.status}
              </TextZbl>
            </div>
          )}
        </div>
      </div>

      <FlashMessage />

      {loading && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}
      {config && <ConfigurationForm config={config} />}
    </div>
  );
}
