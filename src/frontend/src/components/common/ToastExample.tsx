import React, { useState } from "react";
import { Button } from "./Button";
import { Toast } from "./Toast";

/**
 * Example component demonstrating Toast usage
 */
export function ToastExample() {
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>({
    isVisible: false,
    type: "info",
    message: "",
  });

  const showToast = (type: "success" | "error" | "warning" | "info", message: string) => {
    setToast({
      isVisible: true,
      type,
      message,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={5000}
      />
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Toast Notification Examples</h3>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => showToast("success", "Operation completed successfully!")}
            variant="success"
            size="small"
          >
            Success Toast
          </Button>
          
          <Button
            onClick={() => showToast("error", "Something went wrong!")}
            variant="error"
            size="small"
          >
            Error Toast
          </Button>
          
          <Button
            onClick={() => showToast("warning", "Please check your input!")}
            variant="warning"
            size="small"
          >
            Warning Toast
          </Button>
          
          <Button
            onClick={() => showToast("info", "Here's some information!")}
            variant="info"
            size="small"
          >
            Info Toast
          </Button>
        </div>
      </div>
    </>
  );
} 