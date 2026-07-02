'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import DropDownZbl from '@components/ui/drop-down-zbl/DropDownZbl';
import Chips from '@components/ui/chips/Chips';
import FormInput from '@components/ui/input/form-input/FormInput';
import useFetch, { clearCacheByPrefix } from '@hooks/api-request/useFetch';
import usePatchActivity from '@hooks/api-request/activity/usePatchActivity';
import { category } from '@prismaInstance/*';
import '../../backoffice.scss';
import './activityEdit.scss';
import Image from 'next/image';

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
    const pictureFile = formData.get('picture');
    // An empty file input still yields a File (size 0, type ''), not null — normalize it.
    const picture = pictureFile instanceof File && pictureFile.size > 0 ? pictureFile : null;
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
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(picture.type)) {
        setSubmitError("L'image doit être au format JPEG, PNG ou WebP.");
        return;
      }

      const maxSizeMo = 4; // < 4.5 Mo recommandé pour Cloudinary server upload
      if (picture.size > maxSizeMo * 1024 * 1024) {
        setSubmitError(`L'image ne doit pas dépasser ${maxSizeMo} Mo.`);
        return;
      }
    }

    const originalCategoryIds = (activity.category_activity?.map((ca) => ca.category_id) ?? [])
      .slice()
      .sort();
    const currentCategoryIds = [...categoryIds].sort();
    const hasChanged =
      name !== activity.name ||
      (picture instanceof File && picture.size > 0) ||
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
        clearCacheByPrefix('/api/activity');
        router.push('/admin/back-office/activities?success=updated&entity=Activité');
      } else if ('error' in res) {
        setSubmitError(res.error);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
    <form
      className="activity-edit"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
    >
      <div className="activity-edit__grid">
        <FormInput
          id="name"
          name="name"
          type="text"
          className="bo-field__input"
          defaultValue={activity.name}
          wrapperClassName="bo-field"
        >
          <TextZbl jetbrains>Nom</TextZbl>
        </FormInput>

        <div className="bo-field">
          <TextZbl jetbrains>Statut</TextZbl>
          <DropDownZbl
            options={statusOptions}
            value={status}
            onChange={(opt) => setStatus(opt.value)}
          />
        </div>

        <div className="bo-field ">
          <TextZbl jetbrains>Catégories</TextZbl>
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
        </div>

        <div className="bo-field field_row">
          <FormInput
            id="picture"
            name="picture"
            type="file"
            className="bo-field__input"
            wrapperClassName="bo-field"
          >
            <TextZbl jetbrains>Image</TextZbl>
          </FormInput>
          {activity.picture ? (
            <Image src={activity.picture} alt="attraction" height={60} width={80} />
          ) : undefined}
        </div>

        <FormInput
          id="description"
          name="description"
          as="textarea"
          className="bo-field__input bo-field__textarea"
          defaultValue={activity.description ?? ''}
          wrapperClassName="bo-field bo-field--full"
        >
          <TextZbl jetbrains>Description</TextZbl>
        </FormInput>
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
