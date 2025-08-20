import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = "",
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state__content">
        {icon && <div className="empty-state__icon">{icon}</div>}
        <h3 className="empty-state__title">{title}</h3>
        <p className="empty-state__description">{description}</p>
        {action && (
          <button className="empty-state__action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
