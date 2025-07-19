import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  index: number;
  variant?: "primary" | "secondary" | "success" | "warning" | "info";
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  variant = "primary",
  onClick,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`stat-card wireframe-card stat-${variant}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stat-icon-wrapper">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
