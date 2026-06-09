'use client';

import ButtonZbl from '@components/ui/buttonZbl/ButtonZbl';
import TextZbl from '@components/ui/textZbl/TextZbl';
import './ConfirmModal.scss';

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
    <div className="confirm-modal__overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <TextZbl tag="h2" jetbrains className="confirm-modal__title">
          {title}
        </TextZbl>
        <TextZbl jetbrains className="confirm-modal__message">
          {message}
        </TextZbl>
        <div className="confirm-modal__footer">
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
      </div>
    </div>
  );
}
