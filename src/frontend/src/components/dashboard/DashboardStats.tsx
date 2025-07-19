import React from 'react';
import { useTranslation } from 'react-i18next';
import StatCard from './StatCard';

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

  return (
    <div className="dashboard-stats">
      <StatCard
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" strokeWidth="2"/>
            <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" strokeWidth="2"/>
            <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" strokeWidth="2"/>
          </svg>
        }
        value={stats.completedProjects}
        label={t("completed_projects_label")}
        index={0}
      />
      
      <StatCard
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" strokeWidth="2"/>
            <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" strokeWidth="2"/>
            <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" strokeWidth="2"/>
          </svg>
        }
        value={stats.certificatesIssued}
        label={t("certificates_issued_label")}
        index={1}
      />
      
      <StatCard
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <path d="M12 6v6l4 2" strokeWidth="2"/>
          </svg>
        }
        value={stats.activeSessions}
        label={t("active_sessions_label")}
        index={2}
      />
      
      <StatCard
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1v22" strokeWidth="2"/>
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeWidth="2"/>
          </svg>
        }
        value={`$${stats.totalValue}`}
        label={t("total_value_label")}
        index={3}
      />
    </div>
  );
};

export default DashboardStats; 