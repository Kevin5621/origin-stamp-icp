import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ArrowLeft,
  Compass,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/common/Button";

interface ErrorPageProps {
  error?: Error;
  errorInfo?: string;
  onRetry?: () => void;
}

/**
 * Error Page - Halaman untuk menampilkan error umum aplikasi
 */
const ErrorPage: React.FC<ErrorPageProps> = ({ error, errorInfo, onRetry }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleExploreMarketplace = () => {
    navigate("/marketplace");
  };

  return (
    <div className="error-page">
      <div className="error-page__container">
        <div className="error-page__content">
          {/* Error Number/Code */}
          <div className="error-page__number">
            <span className="error-number">ERROR</span>
          </div>

          {/* Error Icon */}
          <div className="error-page__icon">
            <AlertTriangle size={80} className="error-icon" />
          </div>

          {/* Error Message */}
          <div className="error-page__message">
            <h1 className="error-page__title">
              {t("error_page_title", "Oops! Something went wrong")}
            </h1>
            <p className="error-page__description">
              {error?.message ||
                errorInfo ||
                t(
                  "error_page_description",
                  "We encountered an unexpected error. Please try again or contact support if the problem persists.",
                )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="error-page__quick-links">
            <h3 className="error-page__quick-title">
              {t("quick_actions", "Quick Actions")}
            </h3>
            <div className="error-page__links-grid">
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
          <div className="error-page__actions">
            <Button
              variant="primary"
              onClick={handleRetry}
              className="error-page__action-btn"
            >
              <RefreshCw size={16} />
              {t("retry", "Try Again")}
            </Button>

            <Button
              variant="secondary"
              onClick={handleGoBack}
              className="error-page__action-btn"
            >
              <ArrowLeft size={16} />
              {t("go_back", "Go Back")}
            </Button>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && error && (
            <details className="error-page__details">
              <summary className="error-page__details-summary">
                {t("error_details", "Error Details")} (Development)
              </summary>
              <div className="error-page__details-content">
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
                    <pre className="error-stack">{error.stack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Help Text */}
          <div className="error-page__help">
            <p className="error-help-text">
              {t(
                "error_help",
                "If this error persists, please contact our support team for assistance.",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
