'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import DropDownZbl from '@components/ui/dropDownZbl/DropDownZbl';
import { clearCache } from '@hooks/api-request/useFetch';
import '../../backoffice.scss';
import './user-edit.scss';

// TODO: remplacer par useFetch quand la route backend existe
const MOCK_USERS = [
  { id: 1, first_name: 'Jean', last_name: 'Dupont', email: 'jean@test.com', role_id: 1 },
  { id: 2, first_name: 'Marie', last_name: 'Martin', email: 'marie@test.com', role_id: 1 },
  { id: 3, first_name: 'Admin', last_name: 'User', email: 'admin@test.com', role_id: 2 },
];

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
};

const roleOptions = [
  { value: '1', label: 'customer' },
  { value: '2', label: 'admin' },
];

type FormProps = {
  user: User;
  id: string;
};

function UserEditForm({ user, id }: FormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    role_id: String(user.role_id),
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          role_id: Number(form.role_id),
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok) {
        clearCache('/api/user');
        router.push('/admin/back-office/users?success=updated&entity=Utilisateur');
      } else {
        setSubmitError(json?.message || `Erreur ${res.status}`);
      }
    } catch {
      setSubmitError('Erreur réseau');
    }
  };

  return (
    <div className="user-edit">
      <div className="user-edit__grid">
        <div className="user-edit__field">
          <TextZbl jetbrains>Rôle</TextZbl>
          <DropDownZbl
            options={roleOptions}
            value={form.role_id}
            onChange={(opt) => setForm((prev) => ({ ...prev, role_id: opt.value }))}
          />
        </div>
      </div>

      {submitError && (
        <TextZbl jetbrains color="yellow">
          Erreur : {submitError}
        </TextZbl>
      )}

      <div className="user-edit__footer">
        <ButtonZbl theme="light" navTo="/admin/back-office/users">
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

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const user = MOCK_USERS.find((u) => u.id === Number(id)) ?? null;

  return (
    <div className="backoffice_content">
      <div className="backoffice_content_header">
        <div className="backoffice_content_header_title">
          <div className="backoffice_content_header_title_dash white">
            <TextZbl jetbrains>Modifier l&apos;utilisateur</TextZbl>
          </div>
          <div className="backoffice_content_header_title_items yellow">
            <TextZbl jetbrains color="yellow">
              {user ? `${user.first_name} ${user.last_name}` : `ID : ${id}`}
            </TextZbl>
          </div>
        </div>
      </div>

      {!user && (
        <TextZbl jetbrains color="yellow">
          Utilisateur introuvable
        </TextZbl>
      )}
      {user && <UserEditForm user={user} id={id} />}
    </div>
  );
}
