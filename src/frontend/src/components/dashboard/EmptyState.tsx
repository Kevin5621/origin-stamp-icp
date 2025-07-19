import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  hint?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  hint,
  icon,
  actionButton,
}) => {
  const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );

  return (
    <article className="empty-state-card wireframe-card">
      <div className="empty-state-icon">{icon || defaultIcon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>

      {hint && (
        <div className="empty-state-hint wireframe-badge">
          <svg
            className="hint-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{hint}</span>
        </div>
      )}

      {actionButton && <div className="empty-state-action">{actionButton}</div>}
    </article>
  );
};

export default EmptyState;
