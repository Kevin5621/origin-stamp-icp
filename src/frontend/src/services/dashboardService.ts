import { backend } from "../../../declarations/backend";

// Dashboard service for minimalist dashboard
export interface DashboardData {
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

// Dashboard service for minimalist dashboard
export class dashboardService {
  static async getDashboardData(): Promise<DashboardData> {
    try {
      // Get metrics from backend
      const metrics = await backend.get_dashboard_metrics();

      // Get recent sessions (for now, we'll use mock data for recent sessions and revenue)
      // TODO: Implement get_recent_sessions function in backend later

      return {
        totalSessions: Number(metrics.total_sessions),
        totalCertificates: Number(metrics.total_certificates),
        totalRevenue: 0, // TODO: Implement revenue tracking
        activeUsers: Number(metrics.total_users),
        recentSessions: [], // TODO: Implement recent sessions from backend
        revenueData: [], // TODO: Implement revenue data from backend
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Return default values on error
      return {
        totalSessions: 0,
        totalCertificates: 0,
        totalRevenue: 0,
        activeUsers: 0,
        recentSessions: [],
        revenueData: [],
      };
    }
  }
}
