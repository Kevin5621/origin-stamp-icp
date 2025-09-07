use crate::types::{
    ChartDataPoint, LoginResult, User, UserActivity, UserChartData, UserDashboardData,
    UserDashboardMetrics, UserPerformanceStats,
};
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    static USERS: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
}

fn simple_hash(password: &str) -> String {
    let char_sum: u32 = password.chars().map(|c| c as u32).sum::<u32>();
    format!("{:x}", (password.len() as u32) * 42 + char_sum)
}

fn generate_avatar_url(username: &str) -> String {
    let colors = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"];
    let color_index = username.len() % colors.len();
    let selected_color = colors[color_index];

    format!(
        "https://api.dicebear.com/7.x/lorelei/svg?seed={username}&backgroundColor={selected_color}&radius=50&scale=80&size=128"
    )
}

#[ic_cdk::update]
pub fn register_user(username: String, password: String) -> LoginResult {
    if username.is_empty() || password.is_empty() {
        return LoginResult {
            success: false,
            message: "Username and password cannot be empty".to_string(),
            username: None,
        };
    }

    USERS.with(|users: &RefCell<HashMap<String, User>>| {
        let mut users_map: std::cell::RefMut<'_, HashMap<String, User>> = users.borrow_mut();

        if users_map.contains_key(&username) {
            LoginResult {
                success: false,
                message: "Username already exists".to_string(),
                username: None,
            }
        } else {
            let avatar_url = generate_avatar_url(&username);
            let user = User {
                username: username.clone(),
                password_hash: simple_hash(&password),
                created_at: ic_cdk::api::time(),
                avatar_url: Some(avatar_url),
                subscription_tier: "Free".to_string(),
            };

            users_map.insert(username.clone(), user);

            LoginResult {
                success: true,
                message: "User registered successfully".to_string(),
                username: Some(username),
            }
        }
    })
}

#[ic_cdk::update]
pub fn login(username: String, password: String) -> LoginResult {
    if username.is_empty() || password.is_empty() {
        return LoginResult {
            success: false,
            message: "Username and password cannot be empty".to_string(),
            username: None,
        };
    }

    USERS.with(|users| {
        let users_map = users.borrow();

        match users_map.get(&username) {
            Some(user) => {
                let password_hash = simple_hash(&password);

                if user.password_hash == password_hash {
                    LoginResult {
                        success: true,
                        message: "Login successful".to_string(),
                        username: Some(username),
                    }
                } else {
                    LoginResult {
                        success: false,
                        message: "Invalid password".to_string(),
                        username: None,
                    }
                }
            }
            None => LoginResult {
                success: false,
                message: "User not found".to_string(),
                username: None,
            },
        }
    })
}

#[ic_cdk::query]
pub fn get_all_users() -> Vec<String> {
    USERS.with(|users| users.borrow().keys().cloned().collect())
}

#[ic_cdk::query]
pub fn get_user_info(username: String) -> Option<(String, u64)> {
    USERS.with(|users| {
        users
            .borrow()
            .get(&username)
            .map(|user| (user.username.clone(), user.created_at))
    })
}

#[ic_cdk::query]
pub fn get_user_count() -> usize {
    USERS.with(|users| users.borrow().len())
}

#[ic_cdk::update]
pub fn update_user_avatar(username: String, avatar_url: String) -> Result<bool, String> {
    USERS.with(|users| {
        let mut users_map = users.borrow_mut();
        match users_map.get_mut(&username) {
            Some(user) => {
                user.avatar_url = Some(avatar_url);
                Ok(true)
            }
            None => Err("User not found".to_string()),
        }
    })
}

#[ic_cdk::query]
pub fn get_user_avatar(username: String) -> Option<String> {
    USERS.with(|users| {
        users
            .borrow()
            .get(&username)
            .and_then(|user| user.avatar_url.clone())
    })
}

#[ic_cdk::update]
pub fn update_username(
    old_username: String,
    new_username: String,
    password: String,
) -> LoginResult {
    if old_username.is_empty() || new_username.is_empty() || password.is_empty() {
        return LoginResult {
            success: false,
            message: "Username and password cannot be empty".to_string(),
            username: None,
        };
    }

    if old_username == new_username {
        return LoginResult {
            success: false,
            message: "New username must be different from current username".to_string(),
            username: None,
        };
    }

    USERS.with(|users: &RefCell<HashMap<String, User>>| {
        let mut users_map: std::cell::RefMut<'_, HashMap<String, User>> = users.borrow_mut();

        // Check if old user exists and password is correct
        match users_map.get(&old_username) {
            Some(user) => {
                let password_hash = simple_hash(&password);
                if user.password_hash != password_hash {
                    return LoginResult {
                        success: false,
                        message: "Invalid password".to_string(),
                        username: None,
                    };
                }
            }
            None => {
                return LoginResult {
                    success: false,
                    message: "User not found".to_string(),
                    username: None,
                };
            }
        }

        // Check if new username already exists
        if users_map.contains_key(&new_username) {
            return LoginResult {
                success: false,
                message: "New username already exists".to_string(),
                username: None,
            };
        }

        // Update username
        if let Some(mut user) = users_map.remove(&old_username) {
            user.username = new_username.clone();
            users_map.insert(new_username.clone(), user);

            LoginResult {
                success: true,
                message: "Username updated successfully".to_string(),
                username: Some(new_username),
            }
        } else {
            LoginResult {
                success: false,
                message: "Failed to update username".to_string(),
                username: None,
            }
        }
    })
}

// Dashboard functions
#[ic_cdk::query]
pub fn get_user_dashboard_metrics(username: String) -> Option<UserDashboardMetrics> {
    // Get user sessions
    let user_sessions = crate::modules::physical_art::get_user_sessions(username.clone());
    let total_sessions = user_sessions.len() as u64;
    let active_sessions = user_sessions
        .iter()
        .filter(|s| s.status == "active" || s.status == "uploading")
        .count() as u64;

    // Get user certificates
    let user_certificates = crate::modules::certificates::get_user_certificates(username.clone());
    let certificates_created = user_certificates.len() as u64;

    // Get user NFTs (placeholder - would need to implement get_user_nfts_by_username)
    let nfts_owned = 0u64; // TODO: Implement get_user_nfts_by_username

    // Calculate portfolio value (simplified calculation)
    let portfolio_value_icp = calculate_portfolio_value(&user_certificates);

    // Calculate growth percentage (simplified - would need historical data)
    let portfolio_growth_percentage = calculate_growth_percentage(&user_certificates);

    Some(UserDashboardMetrics {
        total_sessions,
        active_sessions,
        certificates_created,
        nfts_owned,
        portfolio_value_icp,
        portfolio_growth_percentage,
    })
}

#[ic_cdk::query]
pub fn get_user_chart_data(username: String, period: String) -> Option<UserChartData> {
    // Get user sessions and certificates
    let user_sessions = crate::modules::physical_art::get_user_sessions(username.clone());
    let user_certificates = crate::modules::certificates::get_user_certificates(username.clone());

    // Generate chart data based on period
    let chart_data = generate_chart_data(user_sessions, user_certificates, period.clone());

    Some(UserChartData {
        period,
        data: chart_data,
    })
}

#[ic_cdk::query]
pub fn get_user_activity_timeline(username: String, limit: u64) -> Vec<UserActivity> {
    let mut activities = Vec::new();

    // Get user sessions
    let user_sessions = crate::modules::physical_art::get_user_sessions(username.clone());
    for session in user_sessions.iter().take(limit as usize) {
        activities.push(UserActivity {
            id: format!("session_{}", session.session_id),
            activity_type: "session".to_string(),
            title: format!("Art Session: {}", session.art_title),
            description: format!("Session created for '{}'", session.art_title),
            timestamp: session.created_at,
            status: session.status.clone(),
            metadata: format!(
                "{{\"session_id\": \"{}\", \"photo_count\": {}}}",
                session.session_id,
                session.uploaded_photos.len()
            ),
        });
    }

    // Get user certificates
    let user_certificates = crate::modules::certificates::get_user_certificates(username.clone());
    for cert in user_certificates.iter().take(limit as usize) {
        activities.push(UserActivity {
            id: format!("cert_{}", cert.certificate_id),
            activity_type: "certificate".to_string(),
            title: format!("Certificate Created: {}", cert.art_title),
            description: format!("Certificate generated for '{}'", cert.art_title),
            timestamp: cert.issue_date,
            status: cert.certificate_status.clone(),
            metadata: format!(
                "{{\"certificate_id\": \"{}\", \"verification_score\": {}}}",
                cert.certificate_id, cert.verification_score
            ),
        });
    }

    // Sort by timestamp (newest first) and limit
    activities.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    activities.truncate(limit as usize);

    activities
}

#[ic_cdk::query]
pub fn get_user_performance_stats(username: String) -> Option<UserPerformanceStats> {
    let user_certificates = crate::modules::certificates::get_user_certificates(username.clone());
    let user_sessions = crate::modules::physical_art::get_user_sessions(username.clone());

    if user_certificates.is_empty() {
        return Some(UserPerformanceStats {
            avg_verification_score: 0.0,
            total_uploads: 0,
            success_rate: 0.0,
            top_artwork: "No artwork yet".to_string(),
        });
    }

    // Calculate average verification score
    let total_score: u32 = user_certificates.iter().map(|c| c.verification_score).sum();
    let avg_verification_score = total_score as f64 / user_certificates.len() as f64;

    // Calculate total uploads
    let total_uploads: u64 = user_sessions
        .iter()
        .map(|s| s.uploaded_photos.len() as u64)
        .sum();

    // Calculate success rate (certificates vs sessions)
    let completed_sessions = user_sessions
        .iter()
        .filter(|s| s.status == "completed")
        .count();
    let success_rate = if user_sessions.is_empty() {
        0.0
    } else {
        (completed_sessions as f64 / user_sessions.len() as f64) * 100.0
    };

    // Find top artwork (highest verification score)
    let top_artwork = user_certificates
        .iter()
        .max_by_key(|c| c.verification_score)
        .map(|c| c.art_title.clone())
        .unwrap_or_else(|| "No artwork yet".to_string());

    Some(UserPerformanceStats {
        avg_verification_score,
        total_uploads,
        success_rate,
        top_artwork,
    })
}

#[ic_cdk::query]
pub fn get_user_dashboard_data(username: String) -> Option<UserDashboardData> {
    let metrics = get_user_dashboard_metrics(username.clone())?;
    let chart_data = get_user_chart_data(username.clone(), "30d".to_string())?;
    let recent_activities = get_user_activity_timeline(username.clone(), 10);
    let performance_stats = get_user_performance_stats(username)?;

    Some(UserDashboardData {
        metrics,
        chart_data,
        recent_activities,
        performance_stats,
    })
}

// Helper functions
fn calculate_portfolio_value(certificates: &[crate::types::Certificate]) -> f64 {
    // Simplified portfolio calculation
    // In a real implementation, this would consider NFT values, market prices, etc.
    let base_value = 0.5; // Base value per certificate
    let score_multiplier = 0.01; // Additional value based on verification score

    certificates
        .iter()
        .map(|cert| base_value + (cert.verification_score as f64 * score_multiplier))
        .sum()
}

fn calculate_growth_percentage(certificates: &[crate::types::Certificate]) -> f64 {
    // Simplified growth calculation
    // In a real implementation, this would compare with historical data
    if certificates.len() < 2 {
        return 0.0;
    }

    // Mock growth calculation based on recent certificates
    let recent_certificates = certificates.len().min(5);
    let growth_factor = recent_certificates as f64 * 2.5;

    growth_factor.min(100.0) // Cap at 100%
}

fn generate_chart_data(
    sessions: Vec<crate::types::PhysicalArtSession>,
    certificates: Vec<crate::types::Certificate>,
    period: String,
) -> Vec<ChartDataPoint> {
    let days = match period.as_str() {
        "7d" => 7,
        "30d" => 30,
        "90d" => 90,
        "1y" => 365,
        _ => 30,
    };

    let mut chart_data = Vec::new();
    let current_time = ic_cdk::api::time();
    let day_duration = 24 * 60 * 60 * 1_000_000_000; // 1 day in nanoseconds

    for i in 0..days {
        let day_start = current_time - (i as u64 * day_duration);
        let day_end = day_start + day_duration;

        // Count sessions completed on this day
        let sessions_completed = sessions
            .iter()
            .filter(|s| {
                s.updated_at >= day_start && s.updated_at < day_end && s.status == "completed"
            })
            .count() as u64;

        // Count certificates created on this day
        let certificates_created = certificates
            .iter()
            .filter(|c| c.issue_date >= day_start && c.issue_date < day_end)
            .count() as u64;

        // Calculate portfolio value for this day (simplified)
        let portfolio_value = certificates
            .iter()
            .filter(|c| c.issue_date <= day_end)
            .map(|c| 0.5 + (c.verification_score as f64 * 0.01))
            .sum();

        // Format date
        let date = format!("Day {}", days - i);

        chart_data.push(ChartDataPoint {
            date,
            portfolio_value,
            certificates_created,
            sessions_completed,
        });
    }

    chart_data.reverse(); // Show oldest to newest
    chart_data
}
