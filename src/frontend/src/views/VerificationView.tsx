import { useTranslation } from "react-i18next";

interface VerificationViewProps {
  onNavigate: (view: string) => void;
}

const VerificationView: React.FC<VerificationViewProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section
      className="verification-section"
      aria-labelledby="verification-title"
    >
      <div className="bento-verification">
        <header className="verification-header">
          <h2 id="verification-title" className="verification-title">
            {t("certificate_of_authenticity_title")}
          </h2>
          <div className="verified-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{t("work_verified_badge")}</span>
          </div>
        </header>

        <article className="certificate-card">
          <div className="certificate-header">
            <div className="certificate-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="certificate-title">
              {t("certificate_issued_title")}
            </h3>
            <p className="certificate-description">
              {t("certificate_issued_description")}
            </p>
          </div>

          <div className="certificate-details">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">
                  {t("certificate_id_label")}
                </span>
                <span className="detail-value">OS-2024-001</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t("issue_date_label")}</span>
                <span className="detail-value">24 Des 2024</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t("blockchain_label")}</span>
                <span className="detail-value">Internet Computer</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t("status_label")}</span>
                <span className="detail-value status-active">
                  {t("status_active")}
                </span>
              </div>
            </div>
          </div>
        </article>

        <div className="verification-stats-grid">
          <div className="stat-card-large">
            <div className="stat-value">8h 24m</div>
            <div className="stat-label">{t("process_duration_label")}</div>
          </div>
          <div className="stat-card-large">
            <div className="stat-value">1,245</div>
            <div className="stat-label">{t("actions_recorded_label")}</div>
          </div>
          <div className="stat-card-large">
            <div className="stat-value success">✓</div>
            <div className="stat-label">{t("verification_status_label")}</div>
          </div>
        </div>

        <aside className="verification-actions">
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="btn-copy-link"
            aria-label={t("copy_certificate_link_button")}
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>{t("copy_certificate_link_button")}</span>
          </button>
        </aside>
      </div>
    </section>
  );
};

export default VerificationView;
