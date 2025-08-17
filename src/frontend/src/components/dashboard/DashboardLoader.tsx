import React from "react";
import { useTranslation } from "react-i18next";

const DashboardLoader: React.FC = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">{t("dashboard")}</h1>
        <p className="dashboard__subtitle">{t("overview")}</p>
      </div>
      <div className="dashboard-loader">
        <div className="dashboard-loader__spinner"></div>
        <p className="dashboard-loader__message">{t("loading")}</p>
      </div>
    </div>
  );
};

export default DashboardLoader;
export { DashboardLoader };
