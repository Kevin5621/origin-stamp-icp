import React from 'react';
import { useTranslation } from 'react-i18next';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, index }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon">
          {icon}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard; 