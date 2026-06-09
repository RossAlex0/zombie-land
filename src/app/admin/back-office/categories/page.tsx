'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilLine, Trash2, Plus } from 'lucide-react';
import DataTable, { Column } from '@components/block/dataTable/DataTable';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import FlashMessage from '@components/ui/flashMessage/FlashMessage';
import ConfirmModal from '@components/ui/confirmModal/ConfirmModal';
import useFetch from '@hooks/api-request/useFetch';
import '../backoffice.scss';

type Category = {
  [key: string]: unknown;
  id: number;
  label: string;
  created_at: string;
};

const columns: Column<Category>[] = [{ key: 'label', label: 'Nom de la catégorie' }];

export default function CategoriesPage() {
  const router = useRouter();
  const { data, loading, error } = useFetch<Category[]>('/api/category');
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const categories = (data ?? []).filter((c) => !deletedIds.has(c.id));

  const handleDeleteConfirm = async () => {
    if (pendingDeleteId === null) return;
    setDeleteError(null);
    try {
      const res = await fetch(`/api/category/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      setPendingDeleteId(null);
      if (res.ok) {
        setDeletedIds((prev) => new Set([...prev, pendingDeleteId]));
        router.replace('/admin/back-office/categories?success=deleted&entity=Catégorie');
      } else {
        const json = await res.json();
        setDeleteError(json?.error || `Erreur ${res.status}`);
      }
    } catch {
      setDeleteError('Erreur réseau');
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Catégories</TextZbl>
          </div>
          <div className="backoffice_content_header_title_items yellow">
            <TextZbl jetbrains color="yellow">
              {categories.length} items
            </TextZbl>
          </div>
        </div>
        <ButtonZbl theme="light" navTo="/admin/back-office/categories/new">
          <Plus size={16} />
          <span className="btn-label">Ajouter</span>
        </ButtonZbl>
      </div>

      <FlashMessage />
      <ConfirmModal
        isOpen={pendingDeleteId !== null}
        title="Supprimer la catégorie"
        message="Cette action est irréversible. Confirmer la suppression ?"
        confirmLabel="Supprimer"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />

      {loading && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}
      {deleteError && (
        <TextZbl jetbrains color="yellow">
          Suppression impossible : {deleteError}
        </TextZbl>
      )}

      {!loading && !error && (
        <DataTable<Category>
          columns={columns}
          data={categories}
          searchable
          searchKeys={['label']}
          emptyMessage="Aucune catégorie trouvée"
          renderActions={(row) => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ButtonZbl theme="light" navTo={`/admin/back-office/categories/${row.id}`}>
                <PencilLine size={16} />
                <span className="btn-label">Modifier</span>
              </ButtonZbl>
              <ButtonZbl
                theme="custom"
                className="btn-danger"
                navTo=""
                onClick={(e) => {
                  e.preventDefault();
                  setPendingDeleteId(row.id);
                }}
              >
                <Trash2 size={16} />
                <span className="btn-label">Supprimer</span>
              </ButtonZbl>
            </div>
          )}
        />
      )}
    </div>
  );
}
