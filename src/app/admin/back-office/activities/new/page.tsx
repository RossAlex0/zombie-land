'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import DropDownZbl from '@components/ui/dropDownZbl/DropDownZbl';
import Chips from '@components/ui/chips/Chips';
import BackOfficeField from '@components/ui/backOfficeField/BackOfficeField';
import useCreateActivity from '@hooks/api-request/activity/useCreateActivity';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import { category } from '@prismaInstance/*';
import '../../backoffice.scss';
import '../[id]/activity-edit.scss';

const statusOptions = [
  { value: 'open', label: 'open' },
  { value: 'close', label: 'close' },
];

export default function ActivityCreatePage() {
  const router = useRouter();
  const { activity: createActivity, loading } = useCreateActivity();
  const { data: categories } = useFetch<category[]>('/api/category');

  const [status, setStatus] = useState('open');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleCategory = (id: number) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const handleSubmit = async (formData: FormData) => {
    setSubmitError(null);
    const name = (formData.get('name') as string)?.trim() ?? '';
    const picture = (formData.get('picture') as string)?.trim() ?? '';
    const description = (formData.get('description') as string)?.trim() ?? '';

    if (!name) {
      setSubmitError("Le nom de l'activité est obligatoire.");
      return;
    }
    if (name.length < 2) {
      setSubmitError('Le nom doit contenir au moins 2 caractères.');
      return;
    }
    if (name.length > 100) {
      setSubmitError('Le nom ne peut pas dépasser 100 caractères.');
      return;
    }
    if (picture) {
      try {
        new URL(picture);
      } catch {
        setSubmitError("L'URL de l'image n'est pas valide.");
        return;
      }
    }

    const res = await createActivity({
      name,
      description: description || undefined,
      picture: picture || undefined,
      status,
      category_activity: categoryIds.map((id) => ({ category_id: id })),
    });
    if ('ok' in res && res.ok) {
      clearCache('/api/activity');
      router.push('/admin/back-office/activities?success=created&entity=Activité');
    } else if ('error' in res) {
      setSubmitError(res.error);
    }
  };

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Nouvelle activité</TextZbl>
          </div>
        </div>
      </div>

      <form className="activity-edit" action={handleSubmit}>
        <div className="activity-edit__grid">
          <BackOfficeField label="Nom">
            <input className="backoffice-field__input" type="text" name="name" />
          </BackOfficeField>

          <BackOfficeField label="Statut">
            <DropDownZbl
              options={statusOptions}
              value={status}
              onChange={(opt) => setStatus(opt.value)}
            />
          </BackOfficeField>

          <BackOfficeField label="Catégories" fullWidth>
            <div className="activity-edit__categories">
              {categories?.map((cat) => (
                <Chips
                  key={cat.id}
                  category={cat}
                  isActive={categoryIds.includes(cat.id)}
                  onClick={toggleCategory}
                />
              ))}
            </div>
          </BackOfficeField>

          <BackOfficeField label="Image" fullWidth>
            <input className="backoffice-field__input" type="text" name="picture" />
          </BackOfficeField>

          <BackOfficeField label="Description" fullWidth>
            <textarea
              className="backoffice-field__input backoffice-field__textarea"
              name="description"
            />
          </BackOfficeField>
        </div>

        {submitError && (
          <TextZbl jetbrains color="yellow">
            Erreur : {submitError}
          </TextZbl>
        )}

        <div className="activity-edit__footer">
          <ButtonZbl theme="light" navTo="/admin/back-office/activities">
            Annuler
          </ButtonZbl>
          <ButtonZbl type="submit" theme="light">
            {loading ? 'Création...' : 'Créer'}
          </ButtonZbl>
        </div>
      </form>
    </div>
  );
}
