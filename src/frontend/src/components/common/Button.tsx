import { ReactNode } from "react";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "outline"
    | "ghost";
  size?: "small" | "medium" | "large";
}

/**
 * Reusable button component with consistent design
 */
export function Button({
  onClick,
  disabled = false,
  className = "",
  children,
  variant = "primary",
  size = "medium",
}: ButtonProps) {
  const getButtonClass = () => {
    const baseClass = "btn";
    const variantClass = `btn--${variant}`;
    const sizeClass = size !== "medium" ? `btn--${size}` : "";

    return `${baseClass} ${variantClass} ${sizeClass}`.trim();
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getButtonClass()} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
