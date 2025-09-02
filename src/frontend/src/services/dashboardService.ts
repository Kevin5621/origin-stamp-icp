import { backend } from "../../../declarations/backend";
import type {
  DashboardData,
  DashboardMetrics,
  RecentActivity,
  UserStats,
} from "@/types/dashboard";

class DashboardService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const result = await backend.get_dashboard_metrics();
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
      const result = await backend.get_recent_sessions(BigInt(10)); // Get last 10 sessions
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

      const [certificates, sessions] = await Promise.all([
        backend.get_user_certificates(username),
        backend.get_user_sessions(username),
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
}

export const dashboardService = new DashboardService();
