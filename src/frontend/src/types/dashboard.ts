// Dashboard types - simple interface untuk UI
export interface DashboardMetrics {
  total_users: number;
  total_sessions: number;
  total_certificates: number;
}

// New user-specific dashboard types
export interface UserDashboardMetrics {
  total_sessions: number;
  active_sessions: number;
  certificates_created: number;
  nfts_owned: number;
  portfolio_value_icp: number;
  portfolio_growth_percentage: number;
}

export interface ChartDataPoint {
  date: string;
  portfolio_value: number;
  certificates_created: number;
  sessions_completed: number;
}

export interface UserChartData {
  period: string; // "7d", "30d", "90d", "1y"
  data: ChartDataPoint[];
}

export interface UserActivity {
  id: string;
  activity_type: string; // "session", "certificate", "nft", "purchase"
  title: string;
  description: string;
  timestamp: number;
  status: string; // "completed", "pending", "failed"
  metadata: string; // JSON string
}

export interface UserPerformanceStats {
  avg_verification_score: number;
  total_uploads: number;
  success_rate: number;
  top_artwork: string;
}

export interface UserDashboardData {
  metrics: UserDashboardMetrics;
  chart_data: UserChartData;
  recent_activities: UserActivity[];
  performance_stats: UserPerformanceStats;
}

// Legacy types for backward compatibility
export interface DashboardData {
  metrics: DashboardMetrics;
  recent_activities: RecentActivity[];
  user_stats: UserStats;
}

export interface UserStats {
  certificates_created: number;
  sessions_completed: number;
  total_uploads: number;
  verification_score: number;
}

export interface DashboardCard {
  title: string;
  value: string | number;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ComponentType<{ className?: string }>;
}

export interface RecentActivity {
  id: string;
  type: "certificate" | "session" | "upload" | "verification" | "purchase";
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  metadata?: {
    session_id?: string;
    certificate_id?: string;
    file_count?: number;
    verification_score?: number;
    nft_id?: string;
    price?: string;
  };
}
