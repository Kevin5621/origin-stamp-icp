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
    // TODO: Implement real dashboard data from backend
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
