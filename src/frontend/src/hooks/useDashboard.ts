import { useState, useEffect, useCallback } from "react";
import { dashboardStatsService } from "@/services";
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
      const marketplaceStats =
        await dashboardStatsService.getMarketplaceStats();
      const topCreators = await dashboardStatsService.getTopCreators();

      // Create mock dashboard data structure
      const dashboardData = {
        metrics: {
          total_users: parseInt(
            marketplaceStats.totalCreators.replace("+", ""),
          ),
          total_sessions: parseInt(
            marketplaceStats.totalSessions.replace("+", ""),
          ),
          total_certificates: parseInt(
            marketplaceStats.totalArtworks.replace("+", ""),
          ),
        },
        recent_activities: topCreators.map((creator) => ({
          id: creator.username,
          type: "certificate" as const,
          title: `${creator.username} created ${creator.certificateCount} certificates`,
          description: `Active creator with ${creator.sessionCount} sessions`,
          timestamp: Date.now().toString(),
          status: "completed" as const,
          metadata: {
            session_id: creator.username,
            certificate_id: creator.username,
            file_count: creator.certificateCount,
            verification_score: 0,
          },
        })),
        user_stats: {
          certificates_created: 0,
          sessions_completed: 0,
          total_uploads: 0,
          verification_score: 0,
        },
      };

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
      const marketplaceStats =
        await dashboardStatsService.getMarketplaceStats();
      const newMetrics = {
        total_users: parseInt(marketplaceStats.totalCreators.replace("+", "")),
        total_sessions: parseInt(
          marketplaceStats.totalSessions.replace("+", ""),
        ),
        total_certificates: parseInt(
          marketplaceStats.totalArtworks.replace("+", ""),
        ),
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

  const refreshActivities = async () => {
    try {
      const topCreators = await dashboardStatsService.getTopCreators();
      const newActivities = topCreators.map((creator) => ({
        id: creator.username,
        type: "certificate" as const,
        title: `${creator.username} created ${creator.certificateCount} certificates`,
        description: `Active creator with ${creator.sessionCount} sessions`,
        timestamp: Date.now().toString(),
        status: "completed" as const,
        metadata: {
          session_id: creator.username,
          certificate_id: creator.username,
          file_count: creator.certificateCount,
          verification_score: 0,
        },
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
