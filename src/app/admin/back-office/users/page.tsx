'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilLine, Trash2 } from 'lucide-react';
import DataTable, { Column } from '@components/block/dataTable/DataTable';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import FlashMessage from '@components/ui/flashMessage/FlashMessage';
import ConfirmModal from '@components/ui/confirmModal/ConfirmModal';
import '../backoffice.scss';

// TODO: remplacer par useFetch('/api/user') quand la route backend existe
const MOCK_USERS = [
  {
    id: 1,
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean@test.com',
    role_id: 1,
    valid_email: true,
  },
  {
    id: 2,
    first_name: 'Marie',
    last_name: 'Martin',
    email: 'marie@test.com',
    role_id: 1,
    valid_email: false,
  },
  {
    id: 3,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@test.com',
    role_id: 2,
    valid_email: true,
  },
];

type User = {
  [key: string]: unknown;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  valid_email: boolean | null;
};

const columns: Column<User>[] = [
  {
    key: 'first_name',
    label: 'Nom',
    render: (_, row) => `${row.first_name} ${row.last_name}`,
  },
  { key: 'email', label: 'Email' },
  {
    key: 'role_id',
    label: 'Rôle',
    render: (value) => (
      <TextZbl jetbrains color={value === 2 ? 'yellow' : 'white'}>
        {value === 2 ? 'admin' : 'customer'}
      </TextZbl>
    ),
  },
];

export default function UsersPage() {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const users = MOCK_USERS.filter((u) => !deletedIds.has(u.id));

  const handleDeleteConfirm = async () => {
    if (pendingDeleteId === null) return;
    setDeleteError(null);
    try {
      const res = await fetch(`/api/user/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      setPendingDeleteId(null);
      if (res.ok) {
        setDeletedIds((prev) => new Set([...prev, pendingDeleteId]));
        router.replace('/admin/back-office/users?success=deleted&entity=Utilisateur');
      } else {
        const json = await res.json();
        setDeleteError(json?.message || `Erreur ${res.status}`);
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
            <TextZbl jetbrains>Utilisateurs</TextZbl>
          </div>
          <div className="backoffice_content_header_title_items yellow">
            <TextZbl jetbrains color="yellow">
              {users.length} utilisateurs
            </TextZbl>
          </div>
        </div>
      </div>

      <FlashMessage />
      <ConfirmModal
        isOpen={pendingDeleteId !== null}
        title="Supprimer l'utilisateur"
        message="Cette action est irréversible. Confirmer la suppression ?"
        confirmLabel="Supprimer"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />

      {deleteError && (
        <TextZbl jetbrains color="yellow">
          Suppression impossible : {deleteError}
        </TextZbl>
      )}

      <DataTable<User>
        columns={columns}
        data={users}
        searchable
        searchKeys={['first_name', 'last_name', 'email']}
        emptyMessage="Aucun utilisateur trouvé"
        renderActions={(row) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ButtonZbl theme="light" navTo={`/admin/back-office/users/${row.id}`}>
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
    </div>
  );
}
