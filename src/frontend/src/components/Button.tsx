import { ReactNode } from "react";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "cta";
}

/**
 * Reusable button component with semantic Neumorphic classes
 */
export function Button({
  onClick,
  disabled = false,
  className = "",
  children,
  variant = "primary",
}: ButtonProps) {
  const getButtonClass = () => {
    switch (variant) {
      case "cta":
        return "btn-cta";
      case "secondary":
        return "btn-secondary";
      case "primary":
      default:
        return "btn-primary";
    }
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
