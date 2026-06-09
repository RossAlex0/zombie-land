'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import DropDownZbl from '@components/ui/dropDownZbl/DropDownZbl';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import usePatchActivity from '@hooks/api-request/activity/usePatchActivity';
import '../../backoffice.scss';
import './activity-edit.scss';

type Category = { id: number; label: string };

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
  categories: Category[];
};

function ActivityEditForm({ activity, id, categories }: FormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: activity.name ?? '',
    description: activity.description ?? '',
    picture: activity.picture ?? '',
    status: activity.status ?? 'open',
  });
  const [categoryIds, setCategoryIds] = useState<number[]>(
    activity.category_activity?.map((ca) => ca.category_id) ?? []
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { activity: patchActivity } = usePatchActivity(Number(id));

  const toggleCategory = (catId: number) => {
    setCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      const res = await patchActivity({
        name: form.name || undefined,
        description: form.description || undefined,
        picture: form.picture || undefined,
        status: form.status,
        category_activity: categoryIds.map((id) => ({ category_id: id })),
      });
      if ('ok' in res && res.ok) {
        clearCache('/api/activity');
        router.push('/admin/back-office/activities?success=updated&entity=Activité');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
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
            {categories.map((cat) => (
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
          Valider
        </ButtonZbl>
      </div>
    </div>
  );
}

export default function ActivityEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: activity, loading, error } = useFetch<Activity>(`/api/activity/${id}`);
  const { data: categories } = useFetch<Category[]>('/api/category');

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
