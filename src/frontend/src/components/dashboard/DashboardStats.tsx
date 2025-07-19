import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Award, Clock, DollarSign } from "lucide-react";
import StatCard from "./StatCard";

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
      <StatCard
        icon={<CheckCircle size={24} strokeWidth={2} />}
        value={stats.completedProjects}
        label={t("completed_projects_label")}
        index={0}
        variant="success"
        onClick={handleCompletedProjectsClick}
      />

      <StatCard
        icon={<Award size={24} strokeWidth={2} />}
        value={stats.certificatesIssued}
        label={t("certificates_issued_label")}
        index={1}
        variant="primary"
        onClick={handleCertificatesClick}
      />

      <StatCard
        icon={<Clock size={24} strokeWidth={2} />}
        value={stats.activeSessions}
        label={t("active_sessions_label")}
        index={2}
        variant="warning"
        onClick={handleActiveSessionsClick}
      />

      <StatCard
        icon={<DollarSign size={24} strokeWidth={2} />}
        value={`$${stats.totalValue}`}
        label={t("total_value_label")}
        index={3}
        variant="info"
        onClick={handleTotalValueClick}
      />
    </div>
  );
};

export default DashboardStats;
