import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: string;
  description?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  action?: {
    label: string;
    href: string;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  trendType = "neutral",
  action,
}) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "session":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        );
      case "certificate":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case "revenue":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
          </svg>
        );
      case "users":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-3.7 3.7c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L16 10.83V22h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1h-.5v7h-2v-7h-2v7h-2z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
        );
    }
  };

  const getTrendIcon = (type: string) => {
    switch (type) {
      case "positive":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14l5-5 5 5z" />
          </svg>
        );
      case "negative":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h3 className="dashboard-card__title">{title}</h3>
        {icon && <div className="dashboard-card__icon">{getIcon(icon)}</div>}
      </div>

      <div className="dashboard-card__content">
        <div className="dashboard-card__value">{value}</div>
        {description && (
          <p className="dashboard-card__description">{description}</p>
        )}
      </div>

      {(trend || action) && (
        <div className="dashboard-card__footer">
          {trend && (
            <div
              className={`dashboard-card__trend dashboard-card__trend--${trendType}`}
            >
              {getTrendIcon(trendType)}
              <span>{trend}</span>
            </div>
          )}
          {action && (
            <a href={action.href} className="dashboard-card__action">
              {action.label}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
