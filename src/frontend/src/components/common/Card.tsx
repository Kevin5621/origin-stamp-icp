import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "raised" | "inset";
}

/**
 * Reusable card component with semantic Neumorphic classes
 */
export function Card({
  title,
  children,
  className = "",
  variant = "raised",
}: CardProps) {
  const getCardClass = () => {
    switch (variant) {
      case "inset":
        return "card-inset";
      case "raised":
      default:
        return "card-raised";
    }
  };

  return (
    <div className={`${getCardClass()} ${className}`.trim()}>
      {title && (
        <h3 className="text-primary mb-4 text-lg font-semibold">{title}</h3>
      )}
      <div className="text-primary">{children}</div>
    </div>
  );
}
