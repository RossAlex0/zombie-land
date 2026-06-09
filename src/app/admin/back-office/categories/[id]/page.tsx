'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import '../../backoffice.scss';
import './category-edit.scss';

type Category = {
  id: number;
  label: string;
};

type FormProps = {
  category: Category;
  id: string;
};

function CategoryEditForm({ category, id }: FormProps) {
  const router = useRouter();
  const [label, setLabel] = useState(category.label ?? '');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      const res = await fetch(`/api/category/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ label }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok) {
        clearCache('/api/category');
        router.push('/admin/back-office/categories?success=updated&entity=Catégorie');
      } else {
        setSubmitError(json?.error || `Erreur ${res.status}`);
      }
    } catch {
      setSubmitError('Erreur réseau');
    }
  };

  return (
    <div className="category-edit">
      <div className="category-edit__field">
        <TextZbl jetbrains>Nom de la catégorie</TextZbl>
        <input
          className="category-edit__input"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      {submitError && (
        <TextZbl jetbrains color="yellow">
          Erreur : {submitError}
        </TextZbl>
      )}

      <div className="category-edit__footer">
        <ButtonZbl theme="light" navTo="/admin/back-office/categories">
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

export default function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: category, loading, error } = useFetch<Category>(`/api/category/${id}`);

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>
              {category ? `${category.label} - ID : ${id}` : `ID : ${id}`}
            </TextZbl>
          </div>
        </div>
      </div>

      {loading && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}
      {category && <CategoryEditForm category={category} id={id} />}
    </div>
  );
}
