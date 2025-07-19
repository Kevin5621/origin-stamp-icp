import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Navigation bar for switching between views
 */
export function AppNavigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname;
  return (
    <nav className="app-navigation" aria-label="Navigasi utama">
      <div className="nav-container">
        <button
          onClick={() => navigate("/dashboard")}
          className={`nav-button ${currentView === "/dashboard" ? "active" : ""}`}
          aria-current={currentView === "/dashboard" ? "page" : undefined}
        >
          {/* Dashboard icon can be added here */}
          <span>{t("dashboard_nav")}</span>
        </button>
        <button
          onClick={() => navigate("/certificates")}
          className={`nav-button ${currentView === "/certificates" ? "active" : ""}`}
          aria-current={currentView === "/certificates" ? "page" : undefined}
        >
          <span>{t("view_certificates_title")}</span>
        </button>
        <button
          onClick={() => navigate("/")}
          className="nav-button"
          aria-label={t("home_nav")}
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
  );
}
