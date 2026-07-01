'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import DropDownZbl from '@components/ui/drop-down-zbl/DropDownZbl';
import Chips from '@components/ui/chips/Chips';
import FormInput from '@components/ui/input/form-input/FormInput';
import useCreateActivity from '@hooks/api-request/activity/useCreateActivity';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import { category } from '@prismaInstance/*';
import '../../backoffice.scss';
import '../[id]/activityEdit.scss';

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

    const res = await createActivity({
      name,
      description: description || undefined,
      picture: picture || undefined,
      status,
      category_activity: categoryIds.map((id) => ({ category_id: id })),
    });
    if (res?.ok) {
      clearCache('/api/activity');
      router.push('/admin/back-office/activities?success=created&entity=Activité');
    } else if (res?.error) {
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
              {categories?.map((cat) => (
                <Chips
                  key={cat.id}
                  category={cat}
                  isActive={categoryIds.includes(cat.id)}
                  onClick={toggleCategory}
                />
              ))}
            </div>
          </div>

          <FormInput
            id="picture"
            name="picture"
            type="file"
            className="bo-field__input"
            wrapperClassName="bo-field"
          >
            <TextZbl jetbrains>Image</TextZbl>
          </FormInput>

          <FormInput
            id="description"
            name="description"
            as="textarea"
            className="bo-field__input bo-field__textarea"
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
            {loading ? 'Création...' : 'Créer'}
          </ButtonZbl>
        </div>
      </form>
    </div>
  );
}
