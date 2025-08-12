import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Toast } from "../../contexts/ToastContext"; // Import type dari context baru

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({
  toast,
  onRemove,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Match animation duration
  };
  const { t } = useTranslation("common");

  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 6L9 17l-5-5" strokeWidth="2" />
          </svg>
        );
      case "error":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
          </svg>
        );
      case "warning":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M10.29 3.86L1.82 18a2 2 0 002.18 2.92l6.89-1.5a2 2 0 011.82 0l6.89 1.5a2 2 0 002.18-2.92L13.71 3.86a2 2 0 00-3.42 0z"
              strokeWidth="2"
            />
            <path d="M12 9v4" strokeWidth="2" />
            <path d="M12 17h.01" strokeWidth="2" />
          </svg>
        );
      case "info":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 16v-4" strokeWidth="2" />
            <path d="M12 8h.01" strokeWidth="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case "success":
        return "var(--color-success)";
      case "error":
        return "var(--color-error)";
      case "warning":
        return "var(--color-warning)";
      case "info":
        return "var(--color-info)";
      default:
        return "var(--color-text-secondary)";
    }
  };

  return (
    <div
      className={`toast-item ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}
      style={{ borderLeftColor: getToastColor(toast.type) }}
    >
      <div className="toast-icon" style={{ color: getToastColor(toast.type) }}>
        {getToastIcon(toast.type)}
      </div>
      <div className="toast-content">
        <p className="toast-message">{toast.message}</p>
      </div>
      <button
        className="toast-close"
        onClick={handleRemove}
        aria-label={t("close_toast")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  if (toasts.length === 0) {
    console.log("No toasts to display");
    return null;
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
