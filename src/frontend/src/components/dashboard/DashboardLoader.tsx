import React from "react";
import { useTranslation } from "react-i18next";

const DashboardLoader: React.FC = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="dashboard">
      <div className="dashboard-loader">
        <div className="dashboard-loader__spinner"></div>
        <p className="dashboard-loader__message">{t("loading")}</p>
      </div>
    </div>
  );
};

export default DashboardLoader;
export { DashboardLoader };
