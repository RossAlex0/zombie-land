'use client';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import FormInput from '@components/ui/input/form-input/FormInput';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { X } from 'lucide-react';
import { useState } from 'react';

import '../modalZbl.scss';
import ModalZbl from '../ModalZbl';

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
    <ModalZbl onClose={onClose}>
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
    </ModalZbl>
  );
}
