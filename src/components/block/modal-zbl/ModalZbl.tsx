import './modalZbl.scss';

type ModalZblProps = {
  onClose: () => void;
  children: React.ReactNode;
};
export default function ModalZbl({ onClose, children }: ModalZblProps) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal_container" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
