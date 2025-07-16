import { useTranslation } from "react-i18next";

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="bento-hero">
        <article className="hero-primary-card">
          <div className="hero-content">
            <h2 id="hero-title" className="hero-title">
              {t("prove_authenticity_title")}
            </h2>
            <p className="hero-description">
              {t("prove_authenticity_description")}
            </p>
            <button
              onClick={() => onNavigate("dashboard")}
              className="btn-hero-cta"
              aria-label={t("start_verification_button")}
            >
              <span className="btn-text">{t("start_verification_button")}</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </article>

        <aside className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="feature-title">
              {t("automatic_verification_title")}
            </h3>
            <p className="feature-description">
              {t("automatic_verification_description")}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="feature-title">{t("blockchain_secure_title")}</h3>
            <p className="feature-description">
              {t("blockchain_secure_description")}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="feature-title">{t("instant_proof_title")}</h3>
            <p className="feature-description">
              {t("instant_proof_description")}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default LandingView;
