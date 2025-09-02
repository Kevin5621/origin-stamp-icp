import { backend } from "../../../declarations/backend";

// Dashboard service for minimalist dashboard
export interface DashboardData {
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

export interface TrendData {
  value: number;
  percentage: number;
  type: "positive" | "negative" | "neutral";
}

export interface DashboardStatsData {
  title: string;
  value: number;
  icon: string;
  trend: TrendData;
}

// Dashboard service for minimalist dashboard
export class dashboardService {
  // Store previous values for trend calculation
  private static previousMetrics: {
    totalSessions: number;
    totalCertificates: number;
    totalRevenue: number;
  } | null = null;

  // Calculate trend based on current and previous values
  private static calculateTrend(current: number, previous: number): TrendData {
    // If no previous data, show neutral trend
    if (previous === 0) {
      return { value: current, percentage: 0, type: "neutral" };
    }

    const change = current - previous;
    const percentage = Math.round((change / previous) * 100);

    let type: "positive" | "negative" | "neutral" = "neutral";
    if (percentage > 0) type = "positive";
    else if (percentage < 0) type = "negative";

    return {
      value: current,
      percentage: Math.abs(percentage),
      type,
    };
  }

  static async getDashboardData(): Promise<DashboardData> {
    try {
      // Get metrics from backend
      const metrics = await backend.get_dashboard_metrics();

      // Get recent sessions from backend
      const recentSessions = await backend.get_recent_sessions(5n); // Get 5 most recent sessions

      // Convert backend sessions to frontend format
      const formattedSessions = recentSessions.map((session) => ({
        id: session.session_id,
        title: session.art_title,
        date: new Date(
          Number(session.created_at) / 1000000,
        ).toLocaleDateString(),
        status: session.status,
      }));

      // Convert backend data to frontend format
      return {
        totalSessions: Number(metrics.total_sessions),
        totalCertificates: Number(metrics.total_certificates),
        totalRevenue: 0, // TODO: Implement revenue tracking in backend
        recentSessions: formattedSessions,
        revenueData: [], // TODO: Implement revenue data in backend
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Return default values on error
      return {
        totalSessions: 0,
        totalCertificates: 0,
        totalRevenue: 0,
        recentSessions: [],
        revenueData: [],
      };
    }
  }

  // Get realtime updates for dashboard metrics with trend calculation
  static async getRealtimeMetrics(): Promise<{
    totalSessions: number;
    totalCertificates: number;
    totalUsers: number;
    trends: {
      sessions: TrendData;
      certificates: TrendData;
      revenue: TrendData;
    };
  }> {
    try {
      const metrics = await backend.get_dashboard_metrics();

      const currentMetrics = {
        totalSessions: Number(metrics.total_sessions),
        totalCertificates: Number(metrics.total_certificates),
        totalRevenue: 0, // TODO: Implement revenue tracking
      };

      let trends: {
        sessions: TrendData;
        certificates: TrendData;
        revenue: TrendData;
      } = {
        sessions: {
          value: currentMetrics.totalSessions,
          percentage: 0,
          type: "neutral",
        },
        certificates: {
          value: currentMetrics.totalCertificates,
          percentage: 0,
          type: "neutral",
        },
        revenue: {
          value: currentMetrics.totalRevenue,
          percentage: 0,
          type: "neutral",
        },
      };

      // Calculate trends if we have previous data
      if (this.previousMetrics) {
        trends = {
          sessions: this.calculateTrend(
            currentMetrics.totalSessions,
            this.previousMetrics.totalSessions,
          ),
          certificates: this.calculateTrend(
            currentMetrics.totalCertificates,
            this.previousMetrics.totalCertificates,
          ),
          revenue: this.calculateTrend(
            currentMetrics.totalRevenue,
            this.previousMetrics.totalRevenue,
          ),
        };
      }

      // Store current metrics for next comparison
      this.previousMetrics = currentMetrics;

      return {
        ...currentMetrics,
        totalUsers: Number(metrics.total_users),
        trends,
      };
    } catch (error) {
      console.error("Error fetching realtime metrics:", error);
      throw error;
    }
  }

  // Get realtime recent sessions
  static async getRealtimeRecentSessions() {
    try {
      const recentSessions = await backend.get_recent_sessions(5n);
      return recentSessions.map((session) => ({
        id: session.session_id,
        title: session.art_title,
        date: new Date(
          Number(session.created_at) / 1000000,
        ).toLocaleDateString(),
        status: session.status,
      }));
    } catch (error) {
      console.error("Error fetching realtime sessions:", error);
      throw error;
    }
  }

  // Get dashboard stats with trends
  static async getDashboardStats(): Promise<DashboardStatsData[]> {
    try {
      const metrics = await backend.get_dashboard_metrics();

      const currentMetrics = {
        totalSessions: Number(metrics.total_sessions),
        totalCertificates: Number(metrics.total_certificates),
        totalRevenue: 0, // TODO: Implement revenue tracking
      };

      let trends: {
        sessions: TrendData;
        certificates: TrendData;
        revenue: TrendData;
      } = {
        sessions: {
          value: currentMetrics.totalSessions,
          percentage: 0,
          type: "neutral",
        },
        certificates: {
          value: currentMetrics.totalCertificates,
          percentage: 0,
          type: "neutral",
        },
        revenue: {
          value: currentMetrics.totalRevenue,
          percentage: 0,
          type: "neutral",
        },
      };

      // Calculate trends only if we have previous data to compare
      if (
        this.previousMetrics &&
        (this.previousMetrics.totalSessions > 0 ||
          this.previousMetrics.totalCertificates > 0 ||
          this.previousMetrics.totalRevenue > 0)
      ) {
        trends = {
          sessions: this.calculateTrend(
            currentMetrics.totalSessions,
            this.previousMetrics.totalSessions,
          ),
          certificates: this.calculateTrend(
            currentMetrics.totalCertificates,
            this.previousMetrics.totalCertificates,
          ),
          revenue: this.calculateTrend(
            currentMetrics.totalRevenue,
            this.previousMetrics.totalRevenue,
          ),
        };
      }

      // Store current metrics for next comparison
      this.previousMetrics = currentMetrics;

      return [
        {
          title: "Total Sessions",
          value: currentMetrics.totalSessions,
          icon: "session",
          trend: trends.sessions,
        },
        {
          title: "Total Certificates",
          value: currentMetrics.totalCertificates,
          icon: "certificate",
          trend: trends.certificates,
        },
        {
          title: "Total Revenue",
          value: currentMetrics.totalRevenue,
          icon: "revenue",
          trend: trends.revenue,
        },
      ];
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return default stats on error
      return [
        {
          title: "Total Sessions",
          value: 0,
          icon: "session",
          trend: { value: 0, percentage: 0, type: "neutral" },
        },
        {
          title: "Total Certificates",
          value: 0,
          icon: "certificate",
          trend: { value: 0, percentage: 0, type: "neutral" },
        },
        {
          title: "Total Revenue",
          value: 0,
          icon: "revenue",
          trend: { value: 0, percentage: 0, type: "neutral" },
        },
      ];
    }
  }
}
