import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import QuickActionCard from './QuickActionCard';

interface QuickActionsProps {
  onNewProject: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNewProject }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="quick-actions animate-slide-in">
      <h3 className="quick-actions-title">{t("quick_actions_title")}</h3>
      <div className="quick-actions-grid animate-stagger">
        <QuickActionCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="2"/>
            </svg>
          }
          title={t("new_project_button")}
          description={t("new_project_description")}
          onClick={onNewProject}
        />
        
        <QuickActionCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4" strokeWidth="2"/>
              <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" strokeWidth="2"/>
              <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" strokeWidth="2"/>
            </svg>
          }
          title={t("verify_work_title")}
          description={t("verify_work_description")}
          onClick={() => navigate("/verification")}
        />
        
        <QuickActionCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4" strokeWidth="2"/>
              <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" strokeWidth="2"/>
              <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" strokeWidth="2"/>
            </svg>
          }
          title={t("view_certificates_title")}
          description={t("view_certificates_description")}
          onClick={() => navigate("/certificates")}
        />
        
        <QuickActionCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v18h18" strokeWidth="2"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" strokeWidth="2"/>
            </svg>
          }
          title={t("analytics_title")}
          description={t("analytics_description")}
          onClick={() => navigate("/analytics")}
        />
      </div>
    </section>
  );
};

export default QuickActions; 