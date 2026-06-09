'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import DropDownZbl from '@components/ui/dropDownZbl/DropDownZbl';
import useCreateActivity from '@hooks/api-request/activity/useCreateActivity';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import '../../backoffice.scss';
import '../[id]/activity-edit.scss';

type Category = { id: number; label: string };

const statusOptions = [
  { value: 'open', label: 'open' },
  { value: 'close', label: 'close' },
];

export default function ActivityCreatePage() {
  const router = useRouter();
  const { activity: createActivity } = useCreateActivity();
  const { data: categories } = useFetch<Category[]>('/api/category');

  const [form, setForm] = useState({
    name: '',
    description: '',
    picture: '',
    status: 'open',
  });
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleCategory = (id: number) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Le nom de l'activité est obligatoire.";
    if (form.name.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères.';
    if (form.name.trim().length > 100) return 'Le nom ne peut pas dépasser 100 caractères.';
    if (form.picture) {
      try {
        new URL(form.picture);
      } catch {
        return "L'URL de l'image n'est pas valide.";
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }
    const res = await createActivity({
      name: form.name,
      description: form.description || undefined,
      picture: form.picture || undefined,
      status: form.status,
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

      <div className="activity-edit">
        <div className="activity-edit__grid">
          <div className="activity-edit__field">
            <TextZbl jetbrains>Name</TextZbl>
            <input
              className="activity-edit__input"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="activity-edit__field">
            <TextZbl jetbrains>Status</TextZbl>
            <DropDownZbl
              options={statusOptions}
              value={form.status}
              onChange={(opt) => setForm((prev) => ({ ...prev, status: opt.value }))}
            />
          </div>

          <div className="activity-edit__field activity-edit__field--full">
            <TextZbl jetbrains>Catégories</TextZbl>
            <div className="activity-edit__categories">
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`activity-edit__category-chip ${categoryIds.includes(cat.id) ? 'activity-edit__category-chip--selected' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="activity-edit__field activity-edit__field--full">
            <TextZbl jetbrains>Picture</TextZbl>
            <input
              className="activity-edit__input"
              type="text"
              value={form.picture}
              onChange={(e) => setForm((prev) => ({ ...prev, picture: e.target.value }))}
            />
          </div>

          <div className="activity-edit__field activity-edit__field--full">
            <TextZbl jetbrains>Description</TextZbl>
            <textarea
              className="activity-edit__input activity-edit__textarea"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
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
          <ButtonZbl
            theme="light"
            navTo=""
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Créer
          </ButtonZbl>
        </div>
      </div>
    </div>
  );
}
