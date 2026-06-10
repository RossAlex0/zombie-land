'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import DropDownZbl from '@components/ui/dropDownZbl/DropDownZbl';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import useUpdateUserRole from '@hooks/api-request/user/useUpdateUserRole';
import { RoleName } from '@customTypes/enum/roles';
import '../../backoffice.scss';
import './user-edit.scss';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: { name: string };
  valid_email: boolean | null;
  birth_date: string | null;
  created_at: string;
};

const roleOptions = [
  { value: 'customer', label: 'customer' },
  { value: 'admin', label: 'admin' },
];

type FormProps = {
  user: User;
  id: string;
};

function UserEditForm({ user, id }: FormProps) {
  const router = useRouter();
  const [form, setForm] = useState({ role: user.role?.name ?? 'customer' });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { updateUserRole, loading } = useUpdateUserRole();

  const handleSubmit = async () => {
    setSubmitError(null);
    const result = await updateUserRole(Number(id), { role: form.role as RoleName });
    if (result.ok) {
      clearCache('/api/user');
      clearCache(`/api/user/${id}`);
      router.push('/admin/back-office/users?success=updated&entity=Utilisateur');
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <div className="user-edit">
      <div className="user-edit__grid">
        <div className="user-edit__field">
          <TextZbl jetbrains>Prénom</TextZbl>
          <TextZbl jetbrains color="white" className="user-edit__value">
            {user.first_name}
          </TextZbl>
        </div>
        <div className="user-edit__field">
          <TextZbl jetbrains>Nom</TextZbl>
          <TextZbl jetbrains color="white" className="user-edit__value">
            {user.last_name}
          </TextZbl>
        </div>
        <div className="user-edit__field">
          <TextZbl jetbrains>Email</TextZbl>
          <TextZbl jetbrains color="white" className="user-edit__value">
            {user.email}
          </TextZbl>
        </div>
        <div className="user-edit__field">
          <TextZbl jetbrains>Email vérifié</TextZbl>
          <TextZbl
            jetbrains
            color={user.valid_email ? 'white' : 'yellow'}
            className="user-edit__value"
          >
            {user.valid_email ? 'Oui' : 'Non'}
          </TextZbl>
        </div>
        <div className="user-edit__field">
          <TextZbl jetbrains>Date de naissance</TextZbl>
          <TextZbl jetbrains color="white" className="user-edit__value">
            {user.birth_date ? new Date(user.birth_date).toLocaleDateString('fr-FR') : '—'}
          </TextZbl>
        </div>
        <div className="user-edit__field">
          <TextZbl jetbrains>Rôle</TextZbl>
          <DropDownZbl
            options={roleOptions}
            value={form.role}
            onChange={(opt) => setForm((prev) => ({ ...prev, role: opt.value }))}
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
          {loading ? 'Enregistrement...' : 'Valider'}
        </ButtonZbl>
      </div>
    </div>
  );
}

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, loading, error } = useFetch<User>(`/api/user/${id}`);

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

      {loading && <TextZbl jetbrains>Chargement...</TextZbl>}
      {error && (
        <TextZbl jetbrains color="yellow">
          Erreur : {error.message}
        </TextZbl>
      )}
      {!loading && !error && !user && (
        <TextZbl jetbrains color="yellow">
          Utilisateur introuvable
        </TextZbl>
      )}
      {user && <UserEditForm user={user} id={id} />}
    </div>
  );
}
