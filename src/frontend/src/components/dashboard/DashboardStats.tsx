import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Award, Clock, DollarSign } from "lucide-react";

interface ProjectStats {
  completedProjects: number;
  certificatesIssued: number;
  activeSessions: number;
  totalValue: number;
}

interface DashboardStatsProps {
  stats: ProjectStats;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCompletedProjectsClick = () => {
    navigate("/projects?status=completed");
  };

  const handleCertificatesClick = () => {
    navigate("/certificates");
  };

  const handleActiveSessionsClick = () => {
    navigate("/sessions?status=active");
  };

  const handleTotalValueClick = () => {
    navigate("/analytics?view=revenue");
  };

  return (
    <div className="dashboard-stats">
      <div
        className="stat-card stat-card--completed"
        onClick={handleCompletedProjectsClick}
      >
        <div className="stat-card-icon">
          <CheckCircle size={24} strokeWidth={2} />
        </div>
        <div className="stat-card-content">
          <div className="stat-card-value">{stats.completedProjects}</div>
          <div className="stat-card-label">{t("completed_projects_label")}</div>
        </div>
      </div>

      <div
        className="stat-card stat-card--certificates"
        onClick={handleCertificatesClick}
      >
        <div className="stat-card-icon">
          <Award size={24} strokeWidth={2} />
        </div>
        <div className="stat-card-content">
          <div className="stat-card-value">{stats.certificatesIssued}</div>
          <div className="stat-card-label">
            {t("certificates_issued_label")}
          </div>
        </div>
      </div>

      <div
        className="stat-card stat-card--active"
        onClick={handleActiveSessionsClick}
      >
        <div className="stat-card-icon">
          <Clock size={24} strokeWidth={2} />
        </div>
        <div className="stat-card-content">
          <div className="stat-card-value">{stats.activeSessions}</div>
          <div className="stat-card-label">{t("active_sessions_label")}</div>
        </div>
      </div>

      <div
        className="stat-card stat-card--value"
        onClick={handleTotalValueClick}
      >
        <div className="stat-card-icon">
          <DollarSign size={24} strokeWidth={2} />
        </div>
        <div className="stat-card-content">
          <div className="stat-card-value">${stats.totalValue}</div>
          <div className="stat-card-label">{t("total_value_label")}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
