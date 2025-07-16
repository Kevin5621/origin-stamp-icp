import { useState } from "react";
import { Loader, ErrorDisplay, ThemeToggle, Login } from "./components";
import LanguageToggle from "./components/LanguageToggle";
import { useTranslation } from "react-i18next";
import {
  LandingView,
  DashboardView,
  SessionView,
  FinalizationView,
  VerificationView,
  ViewType,
} from "./views";

function App() {
  const [loading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [currentView, setCurrentView] = useState<ViewType>("landing");

  const clearError = () => {
    setError(undefined);
  };

  const navigateToView = (view: ViewType) => {
    setCurrentView(view);
    clearError();
  };

  const { t } = useTranslation();

  const renderCurrentView = () => {
    const viewProps = { onNavigate: navigateToView };

    switch (currentView) {
      case "landing":
        return <LandingView {...viewProps} />;
      case "dashboard":
        return <DashboardView {...viewProps} />;
      case "session":
        return <SessionView {...viewProps} />;
      case "finalization":
        return <FinalizationView {...viewProps} />;
      case "verification":
        return <VerificationView {...viewProps} />;
      default:
        return <LandingView {...viewProps} />;
    }
  };

  return (
    <div className="app-container">
      <div className="controls-container">
        <Login />
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
        <main className="main-content">{renderCurrentView()}</main>

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
