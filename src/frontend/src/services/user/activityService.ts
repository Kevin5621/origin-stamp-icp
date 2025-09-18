/**
 * User Activity Service Module
 * Handles user activity timeline and dashboard data operations
 */

import { getBackendActor, initializeBackend } from "../core/backend";

// Backend types
export interface UserActivity {
  id: string;
  activity_type: string; // "session", "certificate", "nft", "purchase"
  title: string;
  description: string;
  timestamp: bigint;
  status: string; // "completed", "pending", "failed"
  metadata: string; // JSON string
}

export interface UserDashboardData {
  metrics: UserDashboardMetrics;
  chart_data: UserChartData;
  recent_activities: UserActivity[];
  performance_stats: UserPerformanceStats;
}

export interface UserDashboardMetrics {
  total_sessions: bigint;
  active_sessions: bigint;
  certificates_created: bigint;
  nfts_owned: bigint;
  portfolio_value_icp: number;
  portfolio_growth_percentage: number;
}

export interface UserChartData {
  period: string; // "7d", "30d", "90d", "1y"
  data: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  portfolio_value: number;
  certificates_created: bigint;
  sessions_completed: bigint;
}

export interface UserPerformanceStats {
  avg_verification_score: number;
  total_uploads: bigint;
  success_rate: number;
  top_artwork: string;
}

class ActivityService {
  /**
   * Get user activity timeline
   */
  async getUserActivityTimeline(
    username: string,
    limit: number = 20,
  ): Promise<UserActivity[]> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_activity_timeline(
        username,
        BigInt(limit),
      );

      return result;
    } catch (error) {
      console.error("Failed to get user activity timeline:", error);
      throw new Error("Failed to get user activity timeline");
    }
  }

  /**
   * Get user dashboard data (includes recent activities)
   */
  async getUserDashboardData(
    username: string,
  ): Promise<UserDashboardData | null> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_dashboard_data(username);

      if (result.length === 0) {
        return null;
      }

      return result[0]!;
    } catch (error) {
      console.error("Failed to get user dashboard data:", error);
      throw new Error("Failed to get user dashboard data");
    }
  }

  /**
   * Get user dashboard metrics
   */
  async getUserDashboardMetrics(
    username: string,
  ): Promise<UserDashboardMetrics | null> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_dashboard_metrics(username);

      if (result.length === 0) {
        return null;
      }

      return result[0]!;
    } catch (error) {
      console.error("Failed to get user dashboard metrics:", error);
      throw new Error("Failed to get user dashboard metrics");
    }
  }

  /**
   * Get user performance stats
   */
  async getUserPerformanceStats(
    username: string,
  ): Promise<UserPerformanceStats | null> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_performance_stats(username);

      if (result.length === 0) {
        return null;
      }

      return result[0]!;
    } catch (error) {
      console.error("Failed to get user performance stats:", error);
      throw new Error("Failed to get user performance stats");
    }
  }

  /**
   * Get user chart data
   */
  async getUserChartData(
    username: string,
    period: string = "30d",
  ): Promise<UserChartData | null> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_chart_data(username, period);

      if (result.length === 0) {
        return null;
      }

      return result[0]!;
    } catch (error) {
      console.error("Failed to get user chart data:", error);
      throw new Error("Failed to get user chart data");
    }
  }

  /**
   * Convert backend UserActivity to frontend ActivityItem format
   */
  convertToActivityItem(activity: UserActivity): {
    id: string;
    type: "session" | "nft" | "achievement" | "collection";
    title: string;
    description: string;
    timestamp: string;
    metadata?: {
      session_id?: string;
      nft_id?: string;
      achievement_type?: string;
    };
  } {
    // Parse metadata JSON
    let metadata: Record<string, any> = {};
    try {
      metadata = JSON.parse(activity.metadata);
    } catch {
      // If parsing fails, use empty object
    }

    // Convert activity type to frontend format
    let type: "session" | "nft" | "achievement" | "collection" = "session";
    switch (activity.activity_type) {
      case "session":
        type = "session";
        break;
      case "certificate":
      case "nft":
        type = "nft";
        break;
      case "achievement":
        type = "achievement";
        break;
      case "collection":
        type = "collection";
        break;
      default:
        type = "session";
    }

    // Convert timestamp from nanoseconds to ISO string
    const timestampMs = Number(activity.timestamp) / 1_000_000;
    const timestamp = new Date(timestampMs).toISOString();

    return {
      id: activity.id,
      type,
      title: activity.title,
      description: activity.description,
      timestamp,
      metadata: {
        session_id: metadata.session_id,
        nft_id: metadata.nft_id || metadata.certificate_id,
        achievement_type: metadata.achievement_type,
      },
    };
  }

  /**
   * Get recent activities in frontend format
   */
  async getRecentActivities(
    username: string,
    limit: number = 10,
  ): Promise<
    Array<{
      id: string;
      type: "session" | "nft" | "achievement" | "collection";
      title: string;
      description: string;
      timestamp: string;
      metadata?: {
        session_id?: string;
        nft_id?: string;
        achievement_type?: string;
      };
    }>
  > {
    try {
      const activities = await this.getUserActivityTimeline(username, limit);
      return activities.map((activity) => this.convertToActivityItem(activity));
    } catch (error) {
      console.error("Failed to get recent activities:", error);
      return [];
    }
  }
}

export const activityService = new ActivityService();
