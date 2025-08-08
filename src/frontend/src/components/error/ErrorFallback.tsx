import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../common/Button";
import { RefreshCw, ArrowLeft, Home, Compass } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * ErrorFallback - Component untuk menampilkan error fallback UI
 * Digunakan oleh React Error Boundary
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const { t } = useTranslation("common");
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    resetErrorBoundary();
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/";
    }
  };

  const handleGoBack = () => {
    resetErrorBoundary();
    window.history.back();
  };

  const handleRetry = () => {
    resetErrorBoundary();
  };

  const handleExploreMarketplace = () => {
    resetErrorBoundary();
    window.location.href = "/marketplace";
  };

  return (
    <div className="error-fallback">
      <div className="error-fallback__container">
        <div className="error-fallback__content">
          {/* Error Number/Code */}
          <div className="error-fallback__number">
            <span className="error-fallback-number">ERROR</span>
          </div>

          {/* Error Icon */}
          <div className="error-fallback__icon">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="error-fallback-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          {/* Error Message */}
          <div className="error-fallback__message">
            <h1 className="error-fallback__title">
              {t("error_boundary_title", "Something went wrong")}
            </h1>
            <p className="error-fallback__description">
              {t(
                "error_boundary_description",
                "An unexpected error occurred while rendering this component. Please try refreshing the page or contact support if the problem persists.",
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="error-fallback__quick-links">
            <h3 className="error-fallback__quick-title">
              {t("quick_actions", "Quick Actions")}
            </h3>
            <div className="error-fallback__links-grid">
              <button className="quick-link-card" onClick={handleGoHome}>
                <Home size={24} />
                <span>
                  {isAuthenticated
                    ? t("dashboard", "Dashboard")
                    : t("home", "Home")}
                </span>
              </button>

              <button
                className="quick-link-card"
                onClick={handleExploreMarketplace}
              >
                <Compass size={24} />
                <span>{t("marketplace", "Marketplace")}</span>
              </button>

              <button className="quick-link-card" onClick={handleRetry}>
                <RefreshCw size={24} />
                <span>{t("retry", "Try Again")}</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="error-fallback__actions">
            <Button
              variant="primary"
              onClick={handleRetry}
              className="error-fallback__action-btn"
            >
              <RefreshCw size={16} />
              {t("try_again", "Try Again")}
            </Button>

            <Button
              variant="secondary"
              onClick={handleGoBack}
              className="error-fallback__action-btn"
            >
              <ArrowLeft size={16} />
              {t("go_back", "Go Back")}
            </Button>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <details className="error-fallback__details">
              <summary className="error-fallback__details-summary">
                {t("error_details", "Error Details")} (Development)
              </summary>
              <div className="error-fallback__details-content">
                <div className="error-code-block">
                  <h4>Error Name:</h4>
                  <code>{error.name}</code>
                </div>
                <div className="error-code-block">
                  <h4>Error Message:</h4>
                  <code>{error.message}</code>
                </div>
                {error.stack && (
                  <div className="error-code-block">
                    <h4>Stack Trace:</h4>
                    <pre className="error-fallback__error-text">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Help Text */}
          <div className="error-fallback__help">
            <p className="error-fallback-help-text">
              {t(
                "error_boundary_help",
                "If this error persists, please contact our support team for assistance.",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
