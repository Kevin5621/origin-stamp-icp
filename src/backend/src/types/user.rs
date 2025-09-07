use candid::CandidType;

#[derive(Clone, Debug, CandidType)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub created_at: u64,
    pub avatar_url: Option<String>,
    pub subscription_tier: String,
}

#[derive(Clone, Debug, CandidType)]
pub struct LoginResult {
    pub success: bool,
    pub message: String,
    pub username: Option<String>,
}

// Dashboard-related types
#[derive(Clone, Debug, CandidType)]
pub struct UserDashboardMetrics {
    pub total_sessions: u64,
    pub active_sessions: u64,
    pub certificates_created: u64,
    pub nfts_owned: u64,
    pub portfolio_value_icp: f64,
    pub portfolio_growth_percentage: f64,
}

#[derive(Clone, Debug, CandidType)]
pub struct ChartDataPoint {
    pub date: String,
    pub portfolio_value: f64,
    pub certificates_created: u64,
    pub sessions_completed: u64,
}

#[derive(Clone, Debug, CandidType)]
pub struct UserChartData {
    pub period: String, // "7d", "30d", "90d", "1y"
    pub data: Vec<ChartDataPoint>,
}

#[derive(Clone, Debug, CandidType)]
pub struct UserActivity {
    pub id: String,
    pub activity_type: String, // "session", "certificate", "nft", "purchase"
    pub title: String,
    pub description: String,
    pub timestamp: u64,
    pub status: String,   // "completed", "pending", "failed"
    pub metadata: String, // JSON string
}

#[derive(Clone, Debug, CandidType)]
pub struct UserPerformanceStats {
    pub avg_verification_score: f64,
    pub total_uploads: u64,
    pub success_rate: f64,
    pub top_artwork: String,
}

#[derive(Clone, Debug, CandidType)]
pub struct UserDashboardData {
    pub metrics: UserDashboardMetrics,
    pub chart_data: UserChartData,
    pub recent_activities: Vec<UserActivity>,
    pub performance_stats: UserPerformanceStats,
}
