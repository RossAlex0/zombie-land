'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import DropDownZbl from '@components/ui/dropDownZbl/DropDownZbl';
import Chips from '@components/ui/chips/Chips';
import BackOfficeField from '@components/ui/backOfficeField/BackOfficeField';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import usePatchActivity from '@hooks/api-request/activity/usePatchActivity';
import { category } from '@prismaInstance/*';
import '../../backoffice.scss';
import './activity-edit.scss';

type Activity = {
  id: number;
  name: string;
  description: string | null;
  picture: string | null;
  status: string;
  category_activity: { category_id: number }[];
};

const statusOptions = [
  { value: 'open', label: 'open' },
  { value: 'close', label: 'close' },
];

type FormProps = {
  activity: Activity;
  id: string;
  categories: category[];
};

function ActivityEditForm({ activity, id, categories }: FormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(activity.status ?? 'open');
  const [categoryIds, setCategoryIds] = useState<number[]>(
    activity.category_activity?.map((ca) => ca.category_id) ?? []
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { activity: patchActivity, loading } = usePatchActivity(Number(id));

  const toggleCategory = (catId: number) => {
    setCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
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

    const originalCategoryIds = (activity.category_activity?.map((ca) => ca.category_id) ?? [])
      .slice()
      .sort();
    const currentCategoryIds = [...categoryIds].sort();
    const hasChanged =
      name !== activity.name ||
      picture !== (activity.picture ?? '') ||
      description !== (activity.description ?? '') ||
      status !== activity.status ||
      JSON.stringify(currentCategoryIds) !== JSON.stringify(originalCategoryIds);

    if (!hasChanged) {
      router.push('/admin/back-office/activities');
      return;
    }

    try {
      const res = await patchActivity({
        name: name || undefined,
        description: description || undefined,
        picture: picture || undefined,
        status,
        category_activity: categoryIds.map((catId) => ({ category_id: catId })),
      });
      if ('ok' in res && res.ok) {
        clearCache('/api/activity');
        clearCache(`/api/activity/${id}`);
        router.push('/admin/back-office/activities?success=updated&entity=Activité');
      } else if ('error' in res) {
        setSubmitError(res.error);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
    <form className="activity-edit" action={handleSubmit}>
      <div className="activity-edit__grid">
        <BackOfficeField label="Nom">
          <input
            className="backoffice-field__input"
            type="text"
            name="name"
            defaultValue={activity.name}
          />
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
            {categories.map((cat) => (
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
          <input
            className="backoffice-field__input"
            type="text"
            name="picture"
            defaultValue={activity.picture ?? ''}
          />
        </BackOfficeField>

        <BackOfficeField label="Description" fullWidth>
          <textarea
            className="backoffice-field__input backoffice-field__textarea"
            name="description"
            defaultValue={activity.description ?? ''}
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
          {loading ? 'Enregistrement...' : 'Valider'}
        </ButtonZbl>
      </div>
    </form>
  );
}

export default function ActivityEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: activity, loading, error } = useFetch<Activity>(`/api/activity/${id}`);
  const { data: categories } = useFetch<category[]>('/api/category');

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>{activity ? `${activity.name} - ID : ${id}` : `ID : ${id}`}</TextZbl>
          </div>
        </div>
      </div>

      {loading && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}
      {activity && categories && (
        <ActivityEditForm activity={activity} id={id} categories={categories} />
      )}
    </div>
  );
}
