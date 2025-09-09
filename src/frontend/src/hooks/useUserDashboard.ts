import { useState, useEffect, useCallback } from "react";
import { dashboardStatsService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import type {
  UserDashboardData,
  UserDashboardMetrics,
  UserChartData,
  UserActivity,
  UserPerformanceStats,
} from "@/types/dashboard";

export const useUserDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [metrics, setMetrics] = useState<UserDashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<UserChartData | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [performanceStats, setPerformanceStats] =
    useState<UserPerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDashboardData = useCallback(async () => {
    if (!user?.username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const marketplaceStats =
        await dashboardStatsService.getMarketplaceStats();
      const topCreators = await dashboardStatsService.getTopCreators();

      // Create mock user dashboard data structure
      const dashboardData = {
        metrics: {
          total_sessions: parseInt(
            marketplaceStats.totalSessions.replace("+", ""),
          ),
          active_sessions: 0,
          certificates_created: parseInt(
            marketplaceStats.totalArtworks.replace("+", ""),
          ),
          nfts_owned: 0,
          portfolio_value_icp: 0,
          portfolio_growth_percentage: 0,
        },
        chart_data: {
          period: "30d",
          data: [
            {
              date: "2024-01-01",
              portfolio_value: 0,
              certificates_created: 0,
              sessions_completed: 0,
            },
            {
              date: "2024-01-08",
              portfolio_value: 0,
              certificates_created: 0,
              sessions_completed: 0,
            },
            {
              date: "2024-01-15",
              portfolio_value: 0,
              certificates_created: 0,
              sessions_completed: 0,
            },
            {
              date: "2024-01-22",
              portfolio_value: 0,
              certificates_created: 0,
              sessions_completed: 0,
            },
          ],
        },
        recent_activities: topCreators.map((creator) => ({
          id: creator.username,
          activity_type: "certificate",
          title: `${creator.username} created ${creator.certificateCount} certificates`,
          description: `Active creator with ${creator.sessionCount} sessions`,
          timestamp: Date.now(),
          status: "completed",
          metadata: "{}",
        })),
        performance_stats: {
          avg_verification_score: 0,
          total_uploads: 0,
          success_rate: 0,
          top_artwork: "",
        },
      };

      setData(dashboardData);
      setMetrics(dashboardData.metrics);
      setChartData(dashboardData.chart_data);
      setActivities(dashboardData.recent_activities);
      setPerformanceStats(dashboardData.performance_stats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  const refreshMetrics = async () => {
    if (!user?.username) return;

    try {
      const marketplaceStats =
        await dashboardStatsService.getMarketplaceStats();
      const newMetrics = {
        total_sessions: parseInt(
          marketplaceStats.totalSessions.replace("+", ""),
        ),
        active_sessions: 0,
        certificates_created: parseInt(
          marketplaceStats.totalArtworks.replace("+", ""),
        ),
        nfts_owned: 0,
        portfolio_value_icp: 0,
        portfolio_growth_percentage: 0,
      };
      setMetrics(newMetrics);
      if (data) {
        setData({ ...data, metrics: newMetrics });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh metrics",
      );
    }
  };

  const refreshChartData = async (period: string = "30d") => {
    if (!user?.username) return;

    try {
      // Mock implementation - replace with actual service call when available
      const newChartData = {
        period: "30d",
        data: [
          {
            date: "2024-01-01",
            portfolio_value: 0,
            certificates_created: 0,
            sessions_completed: 0,
          },
          {
            date: "2024-01-08",
            portfolio_value: 0,
            certificates_created: 0,
            sessions_completed: 0,
          },
          {
            date: "2024-01-15",
            portfolio_value: 0,
            certificates_created: 0,
            sessions_completed: 0,
          },
          {
            date: "2024-01-22",
            portfolio_value: 0,
            certificates_created: 0,
            sessions_completed: 0,
          },
        ],
      };
      setChartData(newChartData);
      if (data) {
        setData({ ...data, chart_data: newChartData });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh chart data",
      );
    }
  };

  const refreshActivities = async () => {
    if (!user?.username) return;

    try {
      const topCreators = await dashboardStatsService.getTopCreators();
      const newActivities = topCreators.map((creator) => ({
        id: creator.username,
        activity_type: "certificate",
        title: `${creator.username} created ${creator.certificateCount} certificates`,
        description: `Active creator with ${creator.sessionCount} sessions`,
        timestamp: Date.now(),
        status: "completed",
        metadata: "{}",
      }));
      setActivities(newActivities);
      if (data) {
        setData({ ...data, recent_activities: newActivities });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh activities",
      );
    }
  };

  const refreshPerformanceStats = async () => {
    if (!user?.username) return;

    try {
      // Mock implementation - replace with actual service call when available
      const newStats = {
        avg_verification_score: 0,
        total_uploads: 0,
        success_rate: 0,
        top_artwork: "",
      };
      setPerformanceStats(newStats);
      if (data) {
        setData({ ...data, performance_stats: newStats });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to refresh performance stats",
      );
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchUserDashboardData();
    }
  }, [fetchUserDashboardData, user?.username]);

  return {
    data,
    metrics,
    chartData,
    activities,
    performanceStats,
    loading,
    error,
    refreshData: fetchUserDashboardData,
    refreshMetrics,
    refreshChartData,
    refreshActivities,
    refreshPerformanceStats,
  };
};
