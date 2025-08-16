import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ToastProps {
  type: "success" | "error" | "warning" | "info";
  message: string | ReactNode;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

/**
 * Toast notification component that appears on the right side
 */
export function Toast({
  type,
  message,
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) {
  const { t } = useTranslation("common");

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button
          className="toast-close"
          onClick={onClose}
          aria-label={t("close_toast")}
        >
          ×
        </button>
      </div>
    </div>
  );
}
