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
        return "bg-green-500 text-white border-green-600";
      case "error":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      case "info":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
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
        className="ml-4 text-white transition-colors hover:text-gray-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
