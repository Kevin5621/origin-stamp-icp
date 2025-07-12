import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Modal component with semantic Neumorphic classes
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-wrapper modal-backdrop" onClick={onClose}>
      <div
        className={`modal-dialog ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={onClose} className="modal-close">
          ×
        </button>

        {/* Modal content */}
        <div>
          <h2 className="modal-header">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
