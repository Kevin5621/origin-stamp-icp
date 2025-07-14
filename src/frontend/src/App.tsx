import { useState } from "react";
import { Loader, ErrorDisplay, ThemeToggle } from "./components";
import LanguageToggle from "./components/LanguageToggle";
import { useTranslation } from "react-i18next";

function App() {
  const [loading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [currentView, setCurrentView] = useState<
    "landing" | "dashboard" | "session" | "finalization" | "verification"
  >("landing");

  const clearError = () => {
    setError(undefined);
  };

  const navigateToView = (view: typeof currentView) => {
    setCurrentView(view);
    clearError();
  };

  const { t } = useTranslation();

  return (
    <div className="app-container">
      <div className="controls-container">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <div className="page-container">
        {/* Semantic Header */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="brand-title">{t("welcome_message")}</h1>
            <p className="brand-subtitle">{t("hello_world")}</p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          {currentView === "landing" && (
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
                      onClick={() => navigateToView("dashboard")}
                      className="btn-hero-cta"
                      aria-label={t("start_verification_button")}
                    >
                      <span className="btn-text">
                        {t("start_verification_button")}
                      </span>
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
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
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
                      <svg
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
                    </div>
                    <h3 className="feature-title">
                      {t("blockchain_secure_title")}
                    </h3>
                    <p className="feature-description">
                      {t("blockchain_secure_description")}
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="feature-title">
                      {t("instant_proof_title")}
                    </h3>
                    <p className="feature-description">
                      {t("instant_proof_description")}
                    </p>
                  </div>
                </aside>
              </div>
            </section>
          )}

          {currentView === "dashboard" && (
            <section
              className="dashboard-section"
              aria-labelledby="dashboard-title"
            >
              <div className="bento-dashboard">
                <header className="dashboard-header-card">
                  <h2 id="dashboard-title" className="dashboard-title">
                    {t("dashboard_creator_title")}
                  </h2>
                  <button
                    onClick={() => navigateToView("session")}
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
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="empty-state-title">
                      {t("no_projects_title")}
                    </h3>
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
                      <div className="stat-label">
                        {t("completed_projects_label")}
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">0</div>
                      <div className="stat-label">
                        {t("certificates_issued_label")}
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          )}

          {currentView === "session" && (
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
                    onClick={() => navigateToView("finalization")}
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
          )}

          {currentView === "finalization" && (
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
                      <div className="metric-label">
                        {t("total_duration_label")}
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">1,245</div>
                      <div className="metric-label">
                        {t("actions_recorded_label")}
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">24</div>
                      <div className="metric-label">
                        {t("milestones_label")}
                      </div>
                    </div>
                  </div>

                  <div className="success-indicator">
                    <div className="success-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
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
                  <p className="confirmation-text">
                    {t("confirm_finalization_text")}
                  </p>
                  <button
                    onClick={() => navigateToView("verification")}
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
          )}

          {currentView === "verification" && (
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
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
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
                        <span className="detail-label">
                          {t("issue_date_label")}
                        </span>
                        <span className="detail-value">24 Des 2024</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">
                          {t("blockchain_label")}
                        </span>
                        <span className="detail-value">Internet Computer</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">
                          {t("status_label")}
                        </span>
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
                    <div className="stat-label">
                      {t("process_duration_label")}
                    </div>
                  </div>
                  <div className="stat-card-large">
                    <div className="stat-value">1,245</div>
                    <div className="stat-label">
                      {t("actions_recorded_label")}
                    </div>
                  </div>
                  <div className="stat-card-large">
                    <div className="stat-value success">✓</div>
                    <div className="stat-label">
                      {t("verification_status_label")}
                    </div>
                  </div>
                </div>

                <aside className="verification-actions">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(window.location.href)
                    }
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
          )}
        </main>

        {/* Semantic Navigation */}
        {currentView !== "landing" && (
          <nav className="app-navigation" aria-label="Navigasi utama">
            <div className="nav-container">
              <button
                onClick={() => navigateToView("dashboard")}
                className={`nav-button ${currentView === "dashboard" ? "active" : ""}`}
                aria-current={currentView === "dashboard" ? "page" : undefined}
              >
                <svg
                  className="nav-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 15v4m8-4v4"
                  />
                </svg>
                <span>{t("dashboard_nav")}</span>
              </button>
              <button
                onClick={() => navigateToView("landing")}
                className="nav-button"
                aria-label="Kembali ke beranda"
              >
                <svg
                  className="nav-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>{t("home_nav")}</span>
              </button>
            </div>
          </nav>
        )}

        {/* Loading and Error States */}
        {loading && !error && <Loader />}
        {!!error && <ErrorDisplay message={error} />}
      </div>
    </div>
  );
}

export default App;
