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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      totalSessions: 156,
      totalCertificates: 89,
      totalRevenue: 125000,
      activeUsers: 234,
      recentSessions: [
        {
          id: "1",
          title: "Digital Art Session #1",
          date: "2024-01-15",
          status: "Completed",
        },
        {
          id: "2",
          title: "Sculpture Documentation",
          date: "2024-01-14",
          status: "In Progress",
        },
        {
          id: "3",
          title: "Painting Process",
          date: "2024-01-13",
          status: "Completed",
        },
        {
          id: "4",
          title: "Mixed Media Project",
          date: "2024-01-12",
          status: "Pending",
        },
      ],
      revenueData: [
        { month: "Jan", revenue: 15000 },
        { month: "Feb", revenue: 18000 },
        { month: "Mar", revenue: 22000 },
        { month: "Apr", revenue: 19000 },
        { month: "May", revenue: 25000 },
        { month: "Jun", revenue: 28000 },
      ],
    };
  }
}
