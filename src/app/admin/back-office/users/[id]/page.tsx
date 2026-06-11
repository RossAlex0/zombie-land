'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextZbl from '@components/ui/textZbl/TextZbl';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import DropDownZbl from '@components/ui/dropDownZbl/DropDownZbl';
import BackOfficeField from '@components/ui/backOfficeField/BackOfficeField';
import BackOfficeValue from '@components/ui/backOfficeValue/BackOfficeValue';
import useFetch, { clearCache } from '@hooks/api-request/useFetch';
import useUpdateUserRole from '@hooks/api-request/user/useUpdateUserRole';
import { RoleName } from '@customTypes/enum/roles';
import type { IUserBO } from '@customTypes/User';
import '../../backoffice.scss';
import './user-edit.scss';

type User = IUserBO;

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
  const [role, setRole] = useState(user.role?.name ?? 'customer');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { updateUserRole, loading } = useUpdateUserRole();

  const handleSubmit = async () => {
    setSubmitError(null);
    if (role === (user.role?.name ?? 'customer')) {
      router.push('/admin/back-office/users');
      return;
    }
    const result = await updateUserRole(Number(id), { role: role as RoleName });
    if (result.ok) {
      clearCache('/api/user');
      clearCache(`/api/user/${id}`);
      router.push('/admin/back-office/users?success=updated&entity=Utilisateur');
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <form
      className="user-edit"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="user-edit__grid">
        <BackOfficeValue label="Prénom">{user.first_name}</BackOfficeValue>
        <BackOfficeValue label="Nom">{user.last_name}</BackOfficeValue>
        <BackOfficeValue label="Email">{user.email}</BackOfficeValue>
        <BackOfficeValue label="Email vérifié" color={user.valid_email ? 'white' : 'yellow'}>
          {user.valid_email ? 'Oui' : 'Non'}
        </BackOfficeValue>
        <BackOfficeValue label="Date de naissance">
          {user.birth_date ? user.birth_date.split('T')[0].split('-').reverse().join('/') : '—'}
        </BackOfficeValue>

        <BackOfficeField label="Rôle">
          <DropDownZbl options={roleOptions} value={role} onChange={(opt) => setRole(opt.value)} />
        </BackOfficeField>
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
        <ButtonZbl type="submit" theme="light">
          {loading ? 'Enregistrement...' : 'Valider'}
        </ButtonZbl>
      </div>
    </form>
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
