import React from "react";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <div className="quick-action-card" onClick={onClick}>
      <div className="action-icon">{icon}</div>
      <div className="action-content">
        <div className="action-title">{title}</div>
        <div className="action-description">{description}</div>
      </div>
    </div>
  );
};

export default QuickActionCard;
