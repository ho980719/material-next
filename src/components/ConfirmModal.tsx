"use client";

type Props = {
  show: boolean;
  title?: string;
  body?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmVariant?: "primary" | "danger" | "secondary";
};

export default function ConfirmModal({
  show,
  title = "확인",
  body = "이 작업을 진행할까요?",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onClose,
  confirmVariant = "danger",
}: Props) {
  return (
    <>
      <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p className="m-0">{body}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                {cancelText}
              </button>
              <button type="button" className={`btn btn-${confirmVariant}`} onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show" />}
    </>
  );
}


