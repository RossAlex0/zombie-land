'use client';

import { useRouter } from 'next/navigation';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import FormInput from '@components/ui/input/form-input/FormInput';
import { clearCache } from '@hooks/api-request/useFetch';
import useCreateCategory from '@hooks/api-request/category/useCreateCategory';
import { useState } from 'react';
import '../../backoffice.scss';
import '../[id]/categoryEdit.scss';

export default function CategoryCreatePage() {
  const router = useRouter();
  const { category: createCategory, loading, error: hookError } = useCreateCategory();
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
    const result = await createCategory({ label });
    if ('ok' in result && result.ok) {
      clearCache('/api/category');
      router.push('/admin/back-office/categories?success=created&entity=Catégorie');
    } else if ('error' in result) {
      const isDuplicate =
        result.error.toLowerCase().includes('unique') ||
        result.error.toLowerCase().includes('already');
      setSubmitError(isDuplicate ? 'Ce nom de catégorie est déjà utilisé.' : result.error);
    }
  };

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Nouvelle catégorie</TextZbl>
          </div>
        </div>
      </div>

      <form
        className="category-edit"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(new FormData(e.currentTarget));
        }}
      >
        <FormInput
          id="label"
          name="label"
          type="text"
          className="bo-field__input"
          wrapperClassName="bo-field"
        >
          <TextZbl jetbrains>Nom de la catégorie</TextZbl>
        </FormInput>

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
            {loading ? 'Création...' : 'Créer'}
          </ButtonZbl>
        </div>
      </form>
    </div>
  );
}
