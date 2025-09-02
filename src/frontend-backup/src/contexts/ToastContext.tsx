import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import ToastContainer from "../components/common/ToastContainer";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  addToast: (type: ToastType, message: string, duration?: number) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, message: string, duration: number = 5000) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, type, message, duration };

      setToasts((prev) => {
        const newToasts = [...prev, newToast];
        return newToasts;
      });

      // Auto remove toast after duration
      setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      return addToast("success", message, duration);
    },
    [addToast],
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      return addToast("error", message, duration);
    },
    [addToast],
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      return addToast("warning", message, duration);
    },
    [addToast],
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      return addToast("info", message, duration);
    },
    [addToast],
  );

  const value: ToastContextType = {
    success,
    error,
    warning,
    info,
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};
