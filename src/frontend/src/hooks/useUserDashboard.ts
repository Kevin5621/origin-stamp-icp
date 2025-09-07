import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "@/services/dashboardService";
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
      const dashboardData = await dashboardService.getUserDashboardData(
        user.username,
      );
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
      const newMetrics = await dashboardService.getUserDashboardMetrics(
        user.username,
      );
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
      const newChartData = await dashboardService.getUserChartData(
        user.username,
        period,
      );
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
      const newActivities = await dashboardService.getUserActivityTimeline(
        user.username,
        10,
      );
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
      const newStats = await dashboardService.getUserPerformanceStats(
        user.username,
      );
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
