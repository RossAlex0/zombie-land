'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PencilLine, Trash2 } from 'lucide-react';
import DataTable, { Column } from '@components/block/data-table/DataTable';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import DropDownZbl from '@components/ui/drop-down-zbl/DropDownZbl';
import SearchInput from '@components/ui/input/search-input/SearchInput';
import FlashMessage from '@components/ui/flash-message/FlashMessage';
import ConfirmModal from '@components/block/modal-zbl/confirm-modal/ConfirmModal';
import { useUserSearch } from '@hooks/api-request/user/useUserSearch';
import type { IUserBO } from '@customTypes/collections/user';

import '../backoffice.scss';

type User = IUserBO & { [key: string]: unknown };

const columns: Column<User>[] = [
  {
    key: 'first_name',
    label: 'Nom',
    render: (_, row) => `${row.first_name} ${row.last_name}`,
  },
  { key: 'email', label: 'Email', truncate: true },
  {
    key: 'role',
    label: 'Rôle',
    render: (_, row) => (
      <TextZbl jetbrains color={row.role?.name === 'admin' ? 'yellow' : 'white'}>
        {row.role?.name ?? '-'}
      </TextZbl>
    ),
  },
];

const roleOptions = [
  { label: 'Tous les rôles', value: '' },
  { label: 'Admin', value: 'admin' },
  { label: 'Customer', value: 'customer' },
];

const LIMIT = 20;

function UsersPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // L'URL est la source de vérité : recherche, rôle et page survivent à la navigation.
  const urlSearch = searchParams.get('search') ?? '';
  const role = searchParams.get('role') ?? '';
  const page = Number(searchParams.get('page') ?? 1);

  // État local uniquement pour la frappe : l'input réagit immédiatement,
  // l'URL est mise à jour après le debounce.
  const [inputSearch, setInputSearch] = useState(urlSearch);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      // Tout changement de filtre ramène à la page 1
      if (!('page' in updates)) params.delete('page');
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (inputSearch === urlSearch) return;
    const timer = setTimeout(() => updateParams({ search: inputSearch }), 300);
    return () => clearTimeout(timer);
  }, [inputSearch, urlSearch, updateParams]);

  const query = new URLSearchParams();
  if (urlSearch) query.set('search', urlSearch);
  if (role) query.set('role', role);
  query.set('page', String(page));
  query.set('limit', String(LIMIT));

  const { users, total, limit, initialLoading, error, refresh } = useUserSearch(query.toString());

  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
        refresh();
        // On repart des paramètres courants pour conserver recherche, rôle et page
        const params = new URLSearchParams(searchParams.toString());
        params.set('success', 'deleted');
        params.set('entity', 'Utilisateur');
        router.replace(`?${params.toString()}`, { scroll: false });
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
              {total} utilisateurs
            </TextZbl>
          </div>
        </div>
        <DropDownZbl
          options={roleOptions}
          value={role}
          onChange={(opt) => updateParams({ role: opt.value })}
        />
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

      {initialLoading && <TextZbl jetbrains>Chargement...</TextZbl>}
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

      {!error && (
        <>
          <SearchInput
            value={inputSearch}
            onChange={setInputSearch}
            placeholder="Rechercher un utilisateur..."
          />
          <DataTable<User>
            columns={columns}
            data={users as User[]}
            emptyMessage="Aucun utilisateur trouvé"
            total={total}
            page={page}
            limit={limit}
            onPageChange={(p) => updateParams({ page: String(p) })}
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
        </>
      )}
    </div>
  );
}

// useSearchParams reads the URL, which is only known on the client, so Next.js
// requires it to be wrapped in a Suspense boundary. The outer component provides
// that boundary; UsersPageInner holds the actual logic.
export default function UsersPage() {
  return (
    <Suspense>
      <UsersPageInner />
    </Suspense>
  );
}
