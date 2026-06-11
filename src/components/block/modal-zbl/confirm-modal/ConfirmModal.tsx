'use client';

import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ModalZbl from '../ModalZbl';
import './confirmModal.scss';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <ModalZbl onClose={onCancel}>
      <TextZbl tag="h2" jetbrains className="modal_title">
        {title}
      </TextZbl>
      <TextZbl jetbrains className="modal_message">
        {message}
      </TextZbl>
      <div className="modal_footer">
        <ButtonZbl
          theme="light"
          navTo=""
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
        >
          {cancelLabel}
        </ButtonZbl>
        <ButtonZbl
          theme="custom"
          className={danger ? 'btn-danger' : ''}
          navTo=""
          onClick={(e) => {
            e.preventDefault();
            onConfirm();
          }}
        >
          {confirmLabel}
        </ButtonZbl>
      </div>
    </ModalZbl>
  );
}
