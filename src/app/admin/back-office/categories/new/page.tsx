'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import { clearCache } from '@hooks/api-request/useFetch';
import '../../backoffice.scss';
import '../[id]/category-edit.scss';

export default function CategoryCreatePage() {
  const router = useRouter();
  const [label, setLabel] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      const res = await fetch('/api/category', {
        method: 'POST',
        body: JSON.stringify({ label }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok) {
        clearCache('/api/category');
        router.push('/admin/back-office/categories?success=created&entity=Catégorie');
      } else {
        setSubmitError(json?.error || `Erreur ${res.status}`);
      }
    } catch {
      setSubmitError('Erreur réseau');
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
          <TextZbl jetbrains>Label</TextZbl>
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
            Créer
          </ButtonZbl>
        </div>
      </div>
    </div>
  );
}
