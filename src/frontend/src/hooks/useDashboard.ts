import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "@/services/dashboardService";
import { useAuth } from "@/contexts/AuthContext";
import type {
  DashboardData,
  DashboardMetrics,
  RecentActivity,
  UserStats,
} from "@/types/dashboard";

export const useDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardService.getDashboardData(
        user?.username,
      );
      setData(dashboardData);
      setMetrics(dashboardData.metrics);
      setActivities(dashboardData.recent_activities);
      setUserStats(dashboardData.user_stats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  const refreshMetrics = async () => {
    try {
      const newMetrics = await dashboardService.getDashboardMetrics();
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

  const refreshActivities = async () => {
    try {
      const newActivities = await dashboardService.getRecentActivities();
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

  useEffect(() => {
    if (user?.username) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, user?.username]);

  return {
    data,
    metrics,
    activities,
    userStats,
    loading,
    error,
    refreshData: fetchDashboardData,
    refreshMetrics,
    refreshActivities,
  };
};
