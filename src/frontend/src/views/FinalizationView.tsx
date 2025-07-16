import { useTranslation } from "react-i18next";

interface FinalizationViewProps {
  onNavigate: (view: string) => void;
}

const FinalizationView: React.FC<FinalizationViewProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section
      className="finalization-section"
      aria-labelledby="finalization-title"
    >
      <div className="bento-finalization">
        <header className="finalization-header">
          <h2 id="finalization-title" className="finalization-title">
            {t("project_finalization_title")}
          </h2>
          <div className="completion-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{t("process_completed_badge")}</span>
          </div>
        </header>

        <article className="process-summary-card">
          <h3 className="summary-title">
            {t("creative_process_summary_title")}
          </h3>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">8h 24m</div>
              <div className="metric-label">{t("total_duration_label")}</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">1,245</div>
              <div className="metric-label">{t("actions_recorded_label")}</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">24</div>
              <div className="metric-label">{t("milestones_label")}</div>
            </div>
          </div>

          <div className="success-indicator">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="success-content">
              <h4 className="success-title">
                {t("process_recorded_success_title")}
              </h4>
              <p className="success-description">
                {t("process_recorded_success_description")}
              </p>
            </div>
          </div>
        </article>

        <aside className="finalization-actions">
          <p className="confirmation-text">{t("confirm_finalization_text")}</p>
          <button
            onClick={() => onNavigate("verification")}
            className="btn-publish"
            aria-label={t("finalize_and_publish_button")}
          >
            <span>{t("finalize_and_publish_button")}</span>
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </button>
        </aside>
      </div>
    </section>
  );
};

export default FinalizationView;
