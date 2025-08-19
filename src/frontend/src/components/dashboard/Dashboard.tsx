import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardStats from "./DashboardStats";
import DashboardChart from "./DashboardChart";
import DashboardTable from "./DashboardTable";
import DashboardLoader from "./DashboardLoader";
import { dashboardService } from "../../services/dashboardService";

interface DashboardData {
  totalSessions: number;
  totalCertificates: number;
  totalRevenue: number;
  activeUsers: number;
  recentSessions: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
  }>;
  revenueData: Array<{
    month: string;
    revenue: number;
  }>;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await dashboardService.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardLoader />;
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-empty">
          <div className="dashboard-empty__icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h3 className="dashboard-empty__title">{t("error_loading")}</h3>
          <p className="dashboard-empty__description">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <div className="dashboard-empty">
          <div className="dashboard-empty__icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
            </svg>
          </div>
          <h3 className="dashboard-empty__title">{t("no_data")}</h3>
          <p className="dashboard-empty__description">
            {t("no_data_description")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__main">
          <div className="dashboard__section">
            <DashboardStats
              stats={[
                {
                  title: t("total_sessions"),
                  value: data.totalSessions,
                  icon: "session",
                  trend: "+12%",
                  trendType: "positive" as const,
                },
                {
                  title: t("total_certificates"),
                  value: data.totalCertificates,
                  icon: "certificate",
                  trend: "+8%",
                  trendType: "positive" as const,
                },
                {
                  title: t("total_revenue"),
                  value: `$${data.totalRevenue.toLocaleString()}`,
                  icon: "revenue",
                  trend: "+15%",
                  trendType: "positive" as const,
                },
                {
                  title: t("active_users"),
                  value: data.activeUsers,
                  icon: "users",
                  trend: "+5%",
                  trendType: "positive" as const,
                },
              ]}
            />
          </div>

          <div className="dashboard__section">
            <DashboardChart
              title={t("revenue_chart")}
              data={data.revenueData}
              type="line"
            />
          </div>

          <div className="dashboard__section">
            <DashboardTable
              title={t("recent_sessions")}
              data={data.recentSessions}
              columns={[
                { key: "title", label: t("session_title") },
                { key: "date", label: t("date") },
                { key: "status", label: t("status") },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
