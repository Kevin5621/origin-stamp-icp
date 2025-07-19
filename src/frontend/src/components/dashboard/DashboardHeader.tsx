import React from "react";
import { useTranslation } from "react-i18next";

interface DashboardHeaderProps {
  onNewProject: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onNewProject }) => {
  const { t } = useTranslation();

  return (
    <header className="dashboard-header-card animate-fade-in">
      <div className="header-content">
        <h2 id="dashboard-title" className="dashboard-title">
          {t("dashboard_creator_title")}
        </h2>
        <p className="dashboard-subtitle">{t("dashboard_welcome_message")}</p>
      </div>
      <button
        onClick={onNewProject}
        className="btn-new-project hover-lift"
        aria-label={t("new_project_button")}
      >
        <svg
          className="btn-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>{t("new_project_button")}</span>
      </button>
    </header>
  );
};

export default DashboardHeader;
