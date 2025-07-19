import React from "react";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  variant = "secondary",
}) => {
  return (
    <div
      className={`quick-action-card wireframe-card quick-action-${variant}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="action-icon-wrapper">{icon}</div>
      <div className="action-content">
        <h4 className="action-title">{title}</h4>
        <p className="action-description">{description}</p>
      </div>
      <div className="action-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M5 12h14M12 5l7 7-7 7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default QuickActionCard;
