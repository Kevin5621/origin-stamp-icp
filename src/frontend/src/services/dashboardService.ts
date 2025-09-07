import { backendService } from "./backendService";
import type {
  DashboardData,
  DashboardMetrics,
  RecentActivity,
  UserStats,
  UserDashboardData,
  UserDashboardMetrics,
  UserChartData,
  UserActivity,
  UserPerformanceStats,
} from "@/types/dashboard";

class DashboardService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_dashboard_metrics();
      return {
        total_users: Number(result.total_users),
        total_sessions: Number(result.total_sessions),
        total_certificates: Number(result.total_certificates),
      };
    } catch (error) {
      console.error("Failed to fetch dashboard metrics:", error);
      throw new Error("Unable to load dashboard metrics");
    }
  }

  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_recent_sessions(BigInt(10)); // Get last 10 sessions
      return result.map((session) => ({
        id: session.session_id,
        type: "session" as const,
        title: session.art_title,
        timestamp: new Date(Number(session.created_at) / 1000000).toISOString(), // Convert nanoseconds to milliseconds then to ISO string
        status: session.status === "completed" ? "completed" : "pending",
        description: session.description,
        metadata: {
          session_id: session.session_id,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
      throw new Error("Unable to load recent activities");
    }
  }

  async getUserStats(username?: string): Promise<UserStats> {
    try {
      if (!username) {
        throw new Error("Username is required");
      }

      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const [certificates, sessions] = await Promise.all([
        backendActor.get_user_certificates(username),
        backendActor.get_user_sessions(username),
      ]);

      return {
        certificates_created: certificates.length,
        sessions_completed: sessions.filter(
          (session) => session.status === "completed",
        ).length,
        total_uploads: sessions.reduce(
          (total, session) => total + session.uploaded_photos.length,
          0,
        ),
        verification_score:
          certificates.length > 0
            ? Math.round(
                certificates.reduce(
                  (sum, cert) => sum + Number(cert.verification_score),
                  0,
                ) / certificates.length,
              )
            : 0,
      };
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      throw new Error("Unable to load user statistics");
    }
  }

  async getDashboardData(username?: string): Promise<DashboardData> {
    try {
      const [metrics, activities, userStats] = await Promise.all([
        this.getDashboardMetrics(),
        this.getRecentActivities(),
        username
          ? this.getUserStats(username)
          : Promise.resolve({
              certificates_created: 0,
              sessions_completed: 0,
              total_uploads: 0,
              verification_score: 0,
            }),
      ]);

      return {
        metrics,
        recent_activities: activities,
        user_stats: userStats,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      throw new Error("Unable to load dashboard data");
    }
  }

  // New user-specific dashboard methods
  async getUserDashboardMetrics(
    username: string,
  ): Promise<UserDashboardMetrics> {
    try {
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_dashboard_metrics(username);
      if (!result || result.length === 0) {
        throw new Error("No dashboard metrics found");
      }
      const metrics = result[0];
      return {
        total_sessions: Number(metrics.total_sessions),
        active_sessions: Number(metrics.active_sessions),
        certificates_created: Number(metrics.certificates_created),
        nfts_owned: Number(metrics.nfts_owned),
        portfolio_value_icp: Number(metrics.portfolio_value_icp),
        portfolio_growth_percentage: Number(
          metrics.portfolio_growth_percentage,
        ),
      };
    } catch (error) {
      console.error("Failed to fetch user dashboard metrics:", error);
      throw new Error("Unable to load user dashboard metrics");
    }
  }

  async getUserChartData(
    username: string,
    period: string = "30d",
  ): Promise<UserChartData> {
    try {
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_chart_data(username, period);
      if (!result || result.length === 0) {
        throw new Error("No chart data found");
      }
      const chartData = result[0];
      return {
        period: chartData.period,
        data: chartData.data.map(
          (point: {
            date: string;
            portfolio_value: number;
            certificates_created: bigint;
            sessions_completed: bigint;
          }) => ({
            date: point.date,
            portfolio_value: Number(point.portfolio_value),
            certificates_created: Number(point.certificates_created),
            sessions_completed: Number(point.sessions_completed),
          }),
        ),
      };
    } catch (error) {
      console.error("Failed to fetch user chart data:", error);
      throw new Error("Unable to load chart data");
    }
  }

  async getUserActivityTimeline(
    username: string,
    limit: number = 10,
  ): Promise<UserActivity[]> {
    try {
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_activity_timeline(
        username,
        BigInt(limit),
      );
      return result.map(
        (activity: {
          id: string;
          activity_type: string;
          title: string;
          description: string;
          timestamp: bigint;
          status: string;
          metadata: string;
        }) => ({
          id: activity.id,
          activity_type: activity.activity_type,
          title: activity.title,
          description: activity.description,
          timestamp: Number(activity.timestamp),
          status: activity.status,
          metadata: activity.metadata,
        }),
      );
    } catch (error) {
      console.error("Failed to fetch user activity timeline:", error);
      throw new Error("Unable to load activity timeline");
    }
  }

  async getUserPerformanceStats(
    username: string,
  ): Promise<UserPerformanceStats> {
    try {
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_performance_stats(username);
      if (!result || result.length === 0) {
        throw new Error("No performance stats found");
      }
      const stats = result[0];
      return {
        avg_verification_score: Number(stats.avg_verification_score),
        total_uploads: Number(stats.total_uploads),
        success_rate: Number(stats.success_rate),
        top_artwork: stats.top_artwork,
      };
    } catch (error) {
      console.error("Failed to fetch user performance stats:", error);
      throw new Error("Unable to load performance stats");
    }
  }

  async getUserDashboardData(username: string): Promise<UserDashboardData> {
    try {
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_dashboard_data(username);
      if (!result || result.length === 0) {
        throw new Error("No dashboard data found");
      }
      const data = result[0];
      return {
        metrics: {
          total_sessions: Number(data.metrics.total_sessions),
          active_sessions: Number(data.metrics.active_sessions),
          certificates_created: Number(data.metrics.certificates_created),
          nfts_owned: Number(data.metrics.nfts_owned),
          portfolio_value_icp: Number(data.metrics.portfolio_value_icp),
          portfolio_growth_percentage: Number(
            data.metrics.portfolio_growth_percentage,
          ),
        },
        chart_data: {
          period: data.chart_data.period,
          data: data.chart_data.data.map(
            (point: {
              date: string;
              portfolio_value: number;
              certificates_created: bigint;
              sessions_completed: bigint;
            }) => ({
              date: point.date,
              portfolio_value: Number(point.portfolio_value),
              certificates_created: Number(point.certificates_created),
              sessions_completed: Number(point.sessions_completed),
            }),
          ),
        },
        recent_activities: data.recent_activities.map(
          (activity: {
            id: string;
            activity_type: string;
            title: string;
            description: string;
            timestamp: bigint;
            status: string;
            metadata: string;
          }) => ({
            id: activity.id,
            activity_type: activity.activity_type,
            title: activity.title,
            description: activity.description,
            timestamp: Number(activity.timestamp),
            status: activity.status,
            metadata: activity.metadata,
          }),
        ),
        performance_stats: {
          avg_verification_score: Number(
            data.performance_stats.avg_verification_score,
          ),
          total_uploads: Number(data.performance_stats.total_uploads),
          success_rate: Number(data.performance_stats.success_rate),
          top_artwork: data.performance_stats.top_artwork,
        },
      };
    } catch (error) {
      console.error("Failed to fetch user dashboard data:", error);
      throw new Error("Unable to load user dashboard data");
    }
  }
}

export const dashboardService = new DashboardService();
