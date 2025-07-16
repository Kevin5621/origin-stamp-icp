import { useTranslation } from "react-i18next";

interface SessionViewProps {
  onNavigate: (view: string) => void;
}

const SessionView: React.FC<SessionViewProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section
      className="session-section"
      aria-labelledby="session-title"
    >
      <div className="bento-session">
        <header className="session-header-card">
          <h2 id="session-title" className="session-title">
            {t("active_recording_session_title")}
          </h2>
          <div className="session-status-indicator">
            <div
              className="recording-dot"
              aria-label="Sedang merekam"
            ></div>
            <span className="status-text">
              {t("recording_status_text")}
            </span>
          </div>
        </header>

        <article className="session-main-card">
          <div className="session-visual">
            <div className="recording-animation">
              <div className="pulse-ring"></div>
              <div className="pulse-ring delay-1"></div>
              <div className="pulse-ring delay-2"></div>
              <div className="recording-core"></div>
            </div>
          </div>

          <div className="session-content">
            <p className="session-description">
              {t("session_description")}
            </p>

            <div className="session-info">
              <div className="info-item">
                <span className="info-label">
                  {t("plugin_status_label")}
                </span>
                <span className="info-value status-active">
                  {t("status_active")}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  {t("duration_label")}
                </span>
                <span className="info-value">0:00:00</span>
              </div>
            </div>
          </div>
        </article>

        <aside className="session-controls">
          <button
            onClick={() => onNavigate("finalization")}
            className="btn-finalize"
            aria-label={t("finalize_project_button")}
          >
            <span>{t("finalize_project_button")}</span>
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </aside>
      </div>
    </section>
  );
};

export default SessionView;