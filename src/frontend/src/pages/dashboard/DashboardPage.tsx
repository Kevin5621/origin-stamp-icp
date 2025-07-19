import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * Dashboard Page - Halaman dashboard utama
 * Memerlukan autentikasi
 */
const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="dashboard-section" aria-labelledby="dashboard-title">
      <div className="bento-dashboard">
        <header className="dashboard-header-card">
          <h2 id="dashboard-title" className="dashboard-title">
            {t("dashboard_creator_title")}
          </h2>
          <button
            onClick={() => navigate("/session")}
            className="btn-new-project"
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

        <div className="projects-grid">
          <article className="empty-state-card">
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="empty-state-title">{t("no_projects_title")}</h3>
            <p className="empty-state-description">
              {t("no_projects_description")}
            </p>
            <div className="empty-state-hint">
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
              <span>{t("start_verification_journey_hint")}</span>
            </div>
          </article>

          <aside className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">{t("completed_projects_label")}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">{t("certificates_issued_label")}</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
