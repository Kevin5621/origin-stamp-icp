import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, FileCheck, BarChart3 } from "lucide-react";
import QuickActionCard from "./QuickActionCard";

interface QuickActionsProps {
  onNewProject: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNewProject }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="quick-actions-section">
      <div className="quick-actions-header">
        <h3 className="quick-actions-title">{t("quick_actions_title")}</h3>
        <p className="quick-actions-subtitle">{t("quick_actions_subtitle")}</p>
      </div>

      <div className="quick-actions-grid">
        <QuickActionCard
          icon={<Plus size={24} strokeWidth={2} />}
          title={t("new_project_button")}
          description={t("new_project_description")}
          onClick={onNewProject}
          variant="primary"
        />

        <QuickActionCard
          icon={<FileCheck size={24} strokeWidth={2} />}
          title={t("view_certificates_title")}
          description={t("view_certificates_description")}
          onClick={() => navigate("/certificates")}
          variant="secondary"
        />

        <QuickActionCard
          icon={<BarChart3 size={24} strokeWidth={2} />}
          title={t("analytics_title")}
          description={t("analytics_description")}
          onClick={() => navigate("/analytics")}
          variant="secondary"
        />
      </div>
    </section>
  );
};

export default QuickActions;
