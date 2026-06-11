'use client';
import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import FormInput from '@components/ui/FormInput/FormInput';
import TextZbl from '@components/ui/textZbl/TextZbl';
import { X } from 'lucide-react';
import { useState } from 'react';

import '../modalZbl.scss';

type ModalPasswordProps = {
  onValidate: (password: string) => void;
  onClose: () => void;
};
export default function ModalPassword({ onValidate, onClose }: ModalPasswordProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onValidate(password);
  };

  return (
    <>
      <form className="modal_password_form" onSubmit={handleSubmit}>
        <TextZbl color="grey" redPrefix="//">
          Veuillez renseigner votre mot de passe actuel
        </TextZbl>
        <FormInput
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isPassword
        >
          <TextZbl color="white" tag="h4">
            Mot de passe
          </TextZbl>
        </FormInput>
        <ButtonZbl
          type="submit"
          theme="dark"
          disabled={!password.length}
          className="modal_password_btn"
        >
          <TextZbl color="yellow">Confirmez</TextZbl>
        </ButtonZbl>
        <button
          type="button"
          className="modal_password_close"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={20} color="#ac382a" />
        </button>
      </form>
    </>
  );
}
