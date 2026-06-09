'use client';

import { useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import { clearCache } from '@hooks/api-request/useFetch';
import useCreateCategory from '@hooks/api-request/category/useCreateCategory';
import { useState } from 'react';
import '../../backoffice.scss';
import '../[id]/category-edit.scss';

export default function CategoryCreatePage() {
  const router = useRouter();
  const [label, setLabel] = useState('');
  const { category: createCategory, loading, error: hookError } = useCreateCategory();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitError(null);
    const result = await createCategory({ label });
    if ('ok' in result && result.ok) {
      clearCache('/api/category');
      router.push('/admin/back-office/categories?success=created&entity=Catégorie');
    } else if ('error' in result) {
      setSubmitError(result.error);
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

        {(submitError || hookError) && (
          <TextZbl jetbrains color="yellow">
            Erreur : {submitError ?? hookError}
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
            {loading ? 'Création...' : 'Créer'}
          </ButtonZbl>
        </div>
      </div>
    </div>
  );
}
