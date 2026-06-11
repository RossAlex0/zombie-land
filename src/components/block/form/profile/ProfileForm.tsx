'use client';

import { useMemo, useState } from 'react';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import FormInput from '@components/ui/input/form-input/FormInput';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import type { User } from '@context/authProvider';
import './profileForm.scss';

type ProfileValues = {
  first_name: string;
  last_name: string;
  birth_date: string;
  password: string;
  confirmPassword: string;
};

type ProfileFormProps = {
  user: User;
  loading: boolean;
  onSubmitProfile: (fields: Partial<ProfileValues>) => Promise<void>;
  onRequestPasswordChange: (password: string, confirmPassword: string) => void;
};

export default function ProfileForm({
  user,
  loading,
  onSubmitProfile,
  onRequestPasswordChange,
}: ProfileFormProps) {
  const [values, setValues] = useState<ProfileValues>({
    first_name: '',
    last_name: '',
    birth_date: '',
    password: '',
    confirmPassword: '',
  });

  const passwordError = useMemo(() => {
    if (!values.password && !values.confirmPassword) return null;

    if (values.password.length < 12) {
      return `Le mot de passe est trop court (${values.password.length}/12)`;
    }

    if (values.confirmPassword && values.password !== values.confirmPassword) {
      return 'Les mots de passe ne correspondent pas';
    }

    return null;
  }, [values.password, values.confirmPassword]);

  const hasChanges = useMemo(
    () => Object.values(values).some((value) => value.trim() !== ''),
    [values]
  );

  const handleChange = (field: keyof ProfileValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const profileFields = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value.trim() !== '' && key !== 'password' && key !== 'confirmPassword'
      )
    );

    if (Object.keys(profileFields).length > 0) {
      await onSubmitProfile(profileFields);

      setValues((prev) => ({ ...prev, birth_date: '', first_name: '', last_name: '' }));
    }

    if (values.password.length && values.confirmPassword.length) {
      onRequestPasswordChange(values.password, values.confirmPassword);
    }
  };

  return (
    <form className="profile_form" onSubmit={handleSubmit}>
      <FormInput
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        value={user.email}
        onChange={() => {}}
        disabled
      >
        <TextZbl tag="h4">Email</TextZbl>
      </FormInput>

      <FormInput
        id="birthday"
        name="birthday"
        type="date"
        placeholder="Date de naissance"
        value={values.birth_date || (user.birth_date ? String(user.birth_date).slice(0, 10) : '')}
        onChange={(e) => handleChange('birth_date', e.target.value)}
        disabled={loading}
      >
        <TextZbl tag="h4">Date de naissance</TextZbl>
      </FormInput>

      <FormInput
        id="first-name"
        name="first-name"
        type="text"
        placeholder="Prénom"
        value={values.first_name || user.first_name}
        onChange={(e) => handleChange('first_name', e.target.value)}
        disabled={loading}
      >
        <TextZbl tag="h4">Prénom</TextZbl>
      </FormInput>

      <FormInput
        id="last-name"
        name="last-name"
        type="text"
        placeholder="Nom"
        value={values.last_name || user.last_name}
        onChange={(e) => handleChange('last_name', e.target.value)}
        disabled={loading}
      >
        <TextZbl tag="h4">Nom</TextZbl>
      </FormInput>

      <FormInput
        id="password1"
        name="password1"
        type="password"
        placeholder="********"
        value={values.password}
        onChange={(e) => handleChange('password', e.target.value)}
        disabled={loading}
        isPassword
      >
        <TextZbl tag="h4">Mot de passe</TextZbl>
      </FormInput>

      <FormInput
        id="password2"
        name="password2"
        type="password"
        placeholder="********"
        value={values.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        disabled={loading || !values.password}
        isPassword
      >
        <TextZbl tag="h4">Confirmation du mot de passe</TextZbl>
      </FormInput>

      <div className="profile_form_footer">
        {passwordError && (
          <TextZbl redPrefix="//" color="red">
            {passwordError}
          </TextZbl>
        )}
        <ButtonZbl
          type="submit"
          theme="dark"
          style={{ marginLeft: 'auto' }}
          disabled={!!passwordError || !hasChanges}
        >
          <TextZbl color="yellow">Valider les changements</TextZbl>
        </ButtonZbl>
      </div>
    </form>
  );
}
