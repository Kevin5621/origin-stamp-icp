import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, FileCheck, BarChart3, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface QuickActionsProps {
  onNewProject: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNewProject }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleCertificatesClick = () => {
    console.log("Auth state:", { isAuthenticated, user });
    console.log("Navigating to /certificates");
    navigate("/certificates");
  };

  return (
    <div className="quick-actions">
      <div className="quick-action-card" onClick={onNewProject}>
        <div className="quick-action-icon">
          <Plus size={24} strokeWidth={2} />
        </div>
        <div className="quick-action-content">
          <div className="quick-action-title">{t("new_project_button")}</div>
          <div className="quick-action-description">
            {t("new_project_description")}
          </div>
        </div>
        <ArrowRight size={20} strokeWidth={2} className="quick-action-arrow" />
      </div>

      <div className="quick-action-card" onClick={handleCertificatesClick}>
        <div className="quick-action-icon">
          <FileCheck size={24} strokeWidth={2} />
        </div>
        <div className="quick-action-content">
          <div className="quick-action-title">
            {t("view_certificates_title")}
          </div>
          <div className="quick-action-description">
            {t("view_certificates_description")}
          </div>
        </div>
        <ArrowRight size={20} strokeWidth={2} className="quick-action-arrow" />
      </div>

      <div className="quick-action-card" onClick={() => navigate("/analytics")}>
        <div className="quick-action-icon">
          <BarChart3 size={24} strokeWidth={2} />
        </div>
        <div className="quick-action-content">
          <div className="quick-action-title">{t("analytics_title")}</div>
          <div className="quick-action-description">
            {t("analytics_description")}
          </div>
        </div>
        <ArrowRight size={20} strokeWidth={2} className="quick-action-arrow" />
      </div>
    </div>
  );
};

export default QuickActions;
