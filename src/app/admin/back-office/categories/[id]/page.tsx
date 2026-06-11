'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import BackOfficeField from '@components/ui/backOfficeField/BackOfficeField';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import useUpdateCategory from '@hooks/api-request/category/useUpdateCategory';
import '../../backoffice.scss';
import './category-edit.scss';

type Category = {
  id: number;
  label: string;
};

type FormProps = {
  category: Category;
  id: number;
};

function CategoryEditForm({ category, id }: FormProps) {
  const router = useRouter();
  const { category: updateCategory, loading, error: hookError } = useUpdateCategory(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setSubmitError(null);
    const label = (formData.get('label') as string)?.trim() ?? '';
    if (!label) {
      setSubmitError('Le nom de la catégorie est obligatoire.');
      return;
    }
    if (label.length < 2) {
      setSubmitError('Le nom doit contenir au moins 2 caractères.');
      return;
    }
    if (label === category.label) {
      router.push('/admin/back-office/categories');
      return;
    }
    const result = await updateCategory({ label });
    if ('ok' in result && result.ok) {
      clearCache('/api/category');
      router.push('/admin/back-office/categories?success=updated&entity=Catégorie');
    } else if ('error' in result) {
      const isDuplicate =
        result.error.toLowerCase().includes('unique') ||
        result.error.toLowerCase().includes('already');
      setSubmitError(isDuplicate ? 'Ce nom de catégorie est déjà utilisé.' : result.error);
    }
  };

  return (
    <form
      className="category-edit"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
    >
      <BackOfficeField label="Nom de la catégorie">
        <input
          className="backoffice-field__input"
          type="text"
          name="label"
          defaultValue={category.label}
        />
      </BackOfficeField>

      {(submitError || hookError) && (
        <TextZbl jetbrains color="yellow">
          Erreur : {submitError ?? hookError}
        </TextZbl>
      )}

      <div className="category-edit__footer">
        <ButtonZbl theme="light" navTo="/admin/back-office/categories">
          Annuler
        </ButtonZbl>
        <ButtonZbl type="submit" theme="light">
          {loading ? 'Enregistrement...' : 'Valider'}
        </ButtonZbl>
      </div>
    </form>
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
            <TextZbl jetbrains>Modifier la catégorie</TextZbl>
          </div>
          <div className="backoffice_content_header_title_items yellow">
            <TextZbl jetbrains color="yellow">
              {category ? category.label : `ID : ${id}`}
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
      {category && <CategoryEditForm category={category} id={Number(id)} />}
    </div>
  );
}
