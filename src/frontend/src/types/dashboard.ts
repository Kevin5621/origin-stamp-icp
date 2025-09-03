// Dashboard types - simple interface untuk UI
export interface DashboardMetrics {
  total_users: number;
  total_sessions: number;
  total_certificates: number;
}

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
