import React from "react";
import { useTranslation } from "react-i18next";

interface DashboardLoaderProps {
  message?: string;
  variant?: "skeleton" | "spinner" | "dots";
}

const DashboardLoader: React.FC<DashboardLoaderProps> = ({
  message,
  variant = "spinner",
}) => {
  const { t } = useTranslation("dashboard");

  const displayMessage = message || t("loading");

  return (
    <div className="dashboard">
      <div className={`dashboard-loader dashboard-loader--${variant}`}>
        <div className="dashboard-loader__spinner"></div>
        <p className="dashboard-loader__message">{displayMessage}</p>
      </div>
    </div>
  );
};

export default DashboardLoader;
export { DashboardLoader };
