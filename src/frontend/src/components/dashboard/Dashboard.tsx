import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardStats from "./DashboardStats";
import DashboardChart from "./DashboardChart";
import DashboardTable from "./DashboardTable";
import DashboardLoader from "./DashboardLoader";
import {
  dashboardService,
  DashboardStatsData,
} from "../../services/dashboardService";

interface DashboardData {
  totalSessions: number;
  totalCertificates: number;
  totalRevenue: number;
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
  const [stats, setStats] = useState<DashboardStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both dashboard data and stats
        const [dashboardData, dashboardStats] = await Promise.all([
          dashboardService.getDashboardData(),
          dashboardService.getDashboardStats(),
        ]);

        setData(dashboardData);
        setStats(dashboardStats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array for initial fetch only

  // Realtime polling for dashboard metrics (separate effect)
  useEffect(() => {
    if (!data) return; // Only start polling when we have initial data

    const interval = setInterval(async () => {
      try {
        const realtimeMetrics = await dashboardService.getRealtimeMetrics();
        const realtimeStats = await dashboardService.getDashboardStats();

        setData((prevData) => {
          if (!prevData) return prevData;
          return {
            ...prevData,
            totalSessions: realtimeMetrics.totalSessions,
            totalCertificates: realtimeMetrics.totalCertificates,
          };
        });

        setStats(realtimeStats);
      } catch (err) {
        console.error("Error updating realtime metrics:", err);
        // Don't show error to user for realtime updates
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [data]); // Only depend on data existence, not its values

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
              stats={stats.map((stat) => ({
                title: stat.title,
                value: stat.value,
                icon: stat.icon,
                trend:
                  stat.trend.percentage > 0
                    ? `${stat.trend.type === "positive" ? "+" : "-"}${stat.trend.percentage}%`
                    : undefined,
                trendType: stat.trend.type,
              }))}
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
