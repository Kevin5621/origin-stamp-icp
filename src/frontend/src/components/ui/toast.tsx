"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, onRemove }) => {
  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-primary text-primary-foreground border-primary";
      case "error":
        return "bg-destructive text-destructive-foreground border-destructive";
      case "warning":
        return "bg-secondary text-secondary-foreground border-secondary";
      case "info":
        return "bg-accent text-accent-foreground border-accent";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "•";
    }
  };

  return (
    <div
      className={cn(
        "animate-in slide-in-from-right-full flex max-w-[400px] min-w-[300px] items-center justify-between rounded-lg border p-4 shadow-lg duration-300",
        getToastStyles(),
      )}
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg font-semibold">{getIcon()}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="text-foreground hover:text-muted-foreground ml-4 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
