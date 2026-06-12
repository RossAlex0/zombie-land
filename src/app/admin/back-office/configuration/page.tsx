'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import DropDownZbl from '@components/ui/drop-down-zbl/DropDownZbl';
import FormInput from '@components/ui/input/form-input/FormInput';
import FlashMessage from '@components/ui/flash-message/FlashMessage';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import usePatchConfiguration from '@hooks/api-request/configuration/usePatchConfiguration';
import '../backoffice.scss';
import './configuration.scss';
import { configuration } from '@prismaInstance/*';
import { Decimal } from '@prisma/client/runtime/index-browser';

const statusOptions = [
  { value: 'active', label: 'active' },
  { value: 'inactive', label: 'inactive' },
  { value: 'maintenance', label: 'maintenance' },
];

type FormProps = {
  config: Partial<configuration>;
  onSuccess: () => void;
  onStatusChange: (status: string) => void;
};

function ConfigurationForm({ config, onSuccess, onStatusChange }: FormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(config.status);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { patchConfiguration, loading } = usePatchConfiguration();

  const entryPrice = config.entry_price as unknown as number;

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

    const hasChanged =
      entry_price !== Number(config.entry_price) ||
      capacity !== config.capacity ||
      new Date(opening_hours) !== new Date(config.opening_hours!) ||
      new Date(closing_hours) !== new Date(config.closing_hours!) ||
      status !== config.status;

    if (!hasChanged) {
      router.push('/admin/back-office/configuration');
      return;
    }

    const result = await patchConfiguration({
      entry_price,
      capacity,
      status,
      opening_hours,
      closing_hours,
    } as unknown as Partial<configuration>);

    if (result.ok) {
      clearCache('/api/configuration');
      onSuccess();
      router.push('/admin/back-office/configuration?success=updated&entity=Configuration');
    }
    if (result.error) {
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
        <FormInput
          id="entry_price"
          name="entry_price"
          type="number"
          className="bo-field__input"
          min="0"
          step="0.01"
          defaultValue={entryPrice}
          wrapperClassName="bo-field"
        >
          <TextZbl jetbrains>Prix d&apos;entrée (€)</TextZbl>
        </FormInput>

        <FormInput
          id="capacity"
          name="capacity"
          type="number"
          className="bo-field__input"
          min="1"
          step="1"
          defaultValue={config.capacity}
          wrapperClassName="bo-field"
        >
          <TextZbl jetbrains>Capacité</TextZbl>
        </FormInput>

        <FormInput
          id="opening_hours"
          name="opening_hours"
          type="time"
          className="bo-field__input"
          defaultValue={String(config.opening_hours)}
          wrapperClassName="bo-field"
        >
          <TextZbl jetbrains>Heure d&apos;ouverture</TextZbl>
        </FormInput>

        <FormInput
          id="closing_hours"
          name="closing_hours"
          type="time"
          className="bo-field__input"
          defaultValue={String(config.closing_hours)}
          wrapperClassName="bo-field"
        >
          <TextZbl jetbrains>Heure de fermeture</TextZbl>
        </FormInput>

        <div className="bo-field">
          <TextZbl jetbrains>Statut</TextZbl>
          <DropDownZbl
            options={statusOptions}
            value={status}
            onChange={(opt) => {
              setStatus(opt.value);
              onStatusChange(opt.value);
            }}
          />
        </div>
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
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [displayedStatus, setDisplayedStatus] = useState<string | null>(null);
  const {
    data: config,
    loading,
    error,
  } = useFetch<configuration>('/api/configuration', refreshTrigger);

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
                {displayedStatus ?? config.status}
              </TextZbl>
            </div>
          )}
        </div>
      </div>

      <FlashMessage />

      {loading && !config && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}
      {config && (
        <ConfigurationForm
          config={config}
          onSuccess={() => setRefreshTrigger((prev) => !prev)}
          onStatusChange={setDisplayedStatus}
        />
      )}
    </div>
  );
}
