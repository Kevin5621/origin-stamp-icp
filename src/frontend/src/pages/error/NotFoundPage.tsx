import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileQuestion, Home, Search, ArrowLeft, Compass } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/common/Button";

/**
 * NotFound Page - Halaman 404 untuk rute yang tidak ditemukan
 */
const NotFoundPage: React.FC = () => {
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

  const handleExploreMarketplace = () => {
    navigate("/marketplace");
  };

  const handleSearch = () => {
    // In a real app, this would open a search modal or navigate to search page
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="not-found-page">
      <div className="not-found-page__container">
        <div className="not-found-page__content">
          {/* 404 Number */}
          <div className="not-found-page__number">
            <span className="not-found-number">404</span>
          </div>

          {/* Error Icon */}
          <div className="not-found-page__icon">
            <FileQuestion size={80} className="not-found-icon" />
          </div>

          {/* Error Message */}
          <div className="not-found-page__message">
            <h1 className="not-found-page__title">
              {t("not_found_title", "Page Not Found")}
            </h1>
            <p className="not-found-page__description">
              {t(
                "not_found_description",
                "The page you are looking for doesn't exist or has been moved. Let's help you find what you need.",
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="not-found-page__quick-links">
            <h3 className="not-found-page__quick-title">
              {t("quick_links", "Quick Links")}
            </h3>
            <div className="not-found-page__links-grid">
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

              <button className="quick-link-card" onClick={handleSearch}>
                <Search size={24} />
                <span>{t("search", "Search")}</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="not-found-page__actions">
            <Button
              variant="primary"
              onClick={handleGoHome}
              className="not-found-page__action-btn"
            >
              <Home size={16} />
              {isAuthenticated
                ? t("go_to_dashboard", "Go to Dashboard")
                : t("go_home", "Go Home")}
            </Button>

            <Button
              variant="secondary"
              onClick={handleGoBack}
              className="not-found-page__action-btn"
            >
              <ArrowLeft size={16} />
              {t("go_back", "Go Back")}
            </Button>
          </div>

          {/* Help Text */}
          <div className="not-found-page__help">
            <p className="not-found-help-text">
              {t(
                "not_found_help",
                "If you believe this is an error, please contact our support team.",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
