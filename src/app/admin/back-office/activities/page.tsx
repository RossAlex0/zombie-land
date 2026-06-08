'use client';

import { useState } from 'react';
import { PencilLine, Trash2, Plus } from 'lucide-react';
import DataTable, { Column } from '@components/block/dataTable/DataTable';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import StatusBadge, { BadgeStatus } from '@components/ui/statusBadge/StatusBadge';
import useFetch from '@hooks/api-request/useFetch';
import useDeleteActivity from '@hooks/api-request/activity/useDeleteActivity';
import '../backoffice.scss';

type Activity = {
  [key: string]: unknown;
  id: number;
  name: string;
  description: string | null;
  picture: string | null;
  status: string;
  created_at: string;
};

const columns: Column<Activity>[] = [
  { key: 'name', label: 'Activité' },
  {
    key: 'status',
    label: 'Statut',
    render: (value) => <StatusBadge status={value as BadgeStatus} />,
  },
];

export default function ActivitiesPage() {
  const { data, loading, error } = useFetch<Activity[]>('/api/activity');
  const { deleteActivity, error: deleteError } = useDeleteActivity();
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const activities = (data ?? []).filter((a) => !deletedIds.has(a.id));

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette activité ?')) return;
    const result = await deleteActivity(id);
    if ('ok' in result && result.ok) {
      setDeletedIds((prev) => new Set([...prev, id]));
    }
  };

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Activités</TextZbl>
          </div>
          <div className="backoffice_content_header_title_items yellow">
            <TextZbl jetbrains color="yellow">
              {activities.length} items
            </TextZbl>
          </div>
        </div>
        <ButtonZbl theme="light" navTo="/admin/back-office/activities/new">
          <Plus size={16} />
          <span className="btn-label">Créer un item</span>
        </ButtonZbl>
      </div>

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
        <DataTable<Activity>
          columns={columns}
          data={activities}
          searchable
          searchKeys={['name', 'status']}
          emptyMessage="Aucune activité trouvée"
          renderActions={(row) => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ButtonZbl theme="light" navTo={`/admin/back-office/activities/${row.id}`}>
                <PencilLine size={16} />
                <span className="btn-label">Modifier</span>
              </ButtonZbl>
              <ButtonZbl
                theme="custom"
                className="btn-danger"
                navTo=""
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(row.id);
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
