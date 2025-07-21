use candid::CandidType;
use ic_cdk::export_candid;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub created_at: u64,
}

// Login result structure
#[derive(Clone, Debug, CandidType)]
pub struct LoginResult {
    pub success: bool,
    pub message: String,
    pub username: Option<String>,
}

// Physical Art Session structure
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct PhysicalArtSession {
    pub session_id: String,
    pub username: String,
    pub art_title: String,
    pub description: String,
    pub uploaded_photos: Vec<String>,
    pub status: String,
    pub created_at: u64,
    pub updated_at: u64,
}

// Upload file data structure
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct UploadFileData {
    pub filename: String,
    pub content_type: String,
    pub file_size: u64,
}

thread_local! {
    static USERS: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
    static PHYSICAL_ART_SESSIONS: RefCell<HashMap<String, PhysicalArtSession>> = RefCell::new(HashMap::new());
}

// Simple hash function for password (Note: In production, use proper password hashing like bcrypt)
fn simple_hash(password: &str) -> String {
    // This is a very basic hash - in production, use proper password hashing
    let char_sum: u32 = password.chars().map(|c| c as u32).sum::<u32>();
    format!("{:x}", (password.len() as u32) * 42 + char_sum)
}

// Generate random ID
fn generate_random_id() -> String {
    let timestamp = ic_cdk::api::time();
    let random_part = simple_hash(&timestamp.to_string());
    format!(
        "{:x}{:x}",
        timestamp & 0xFFFFFFFF,
        random_part
            .chars()
            .take(8)
            .collect::<String>()
            .parse::<u32>()
            .unwrap_or(0)
    )
}

#[ic_cdk::update]
fn register_user(username: String, password: String) -> LoginResult {
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
            let user = User {
                username: username.clone(),
                password_hash: simple_hash(&password),
                created_at: ic_cdk::api::time(),
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
fn login(username: String, password: String) -> LoginResult {
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
fn get_all_users() -> Vec<String> {
    USERS.with(|users| users.borrow().keys().cloned().collect())
}

#[ic_cdk::query]
fn get_user_info(username: String) -> Option<(String, u64)> {
    USERS.with(|users| {
        users
            .borrow()
            .get(&username)
            .map(|user| (user.username.clone(), user.created_at))
    })
}

#[ic_cdk::query]
fn get_user_count() -> usize {
    USERS.with(|users| users.borrow().len())
}

// Create physical art session
#[ic_cdk::update]
fn create_physical_art_session(
    username: String,
    art_title: String,
    description: String,
) -> Result<String, String> {
    let session_id = generate_random_id();
    let session = PhysicalArtSession {
        session_id: session_id.clone(),
        username: username.clone(),
        art_title,
        description,
        uploaded_photos: Vec::new(),
        status: "draft".to_string(),
        created_at: ic_cdk::api::time(),
        updated_at: ic_cdk::api::time(),
    };

    PHYSICAL_ART_SESSIONS.with(|sessions| {
        sessions.borrow_mut().insert(session_id.clone(), session);
    });

    Ok(session_id)
}

// Generate upload URL using S3 configuration
#[ic_cdk::update]
fn generate_upload_url(session_id: String, file_data: UploadFileData) -> Result<String, String> {
    S3_CONFIG.with(|config| {
        match config.borrow().as_ref() {
            Some(s3_config) => {
                let base_url = match &s3_config.endpoint {
                    Some(endpoint) => endpoint.clone(),
                    None => format!(
                        "https://{}.s3.{}.amazonaws.com",
                        s3_config.bucket_name, s3_config.region
                    ),
                };

                // Generate S3 object URL
                let object_key = format!("{}/{}", session_id, file_data.filename);
                Ok(format!("{}/{}", base_url, object_key))
            }
            None => {
                Err("S3 configuration not found. Please configure S3 settings first.".to_string())
            }
        }
    })
}

// Upload photo to session (record the uploaded photo)
#[ic_cdk::update]
fn upload_photo_to_session(session_id: String, photo_url: String) -> Result<bool, String> {
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        let mut sessions_map = sessions.borrow_mut();
        match sessions_map.get_mut(&session_id) {
            Some(session) => {
                session.uploaded_photos.push(photo_url);
                session.updated_at = ic_cdk::api::time();
                Ok(true)
            }
            None => Err("Session not found".to_string()),
        }
    })
}

// Get session details
#[ic_cdk::query]
fn get_session_details(session_id: String) -> Option<PhysicalArtSession> {
    PHYSICAL_ART_SESSIONS.with(|sessions| sessions.borrow().get(&session_id).cloned())
}

// Get user sessions
#[ic_cdk::query]
fn get_user_sessions(username: String) -> Vec<PhysicalArtSession> {
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        sessions
            .borrow()
            .values()
            .filter(|session| session.username == username)
            .cloned()
            .collect()
    })
}

// Update session status
#[ic_cdk::update]
fn update_session_status(session_id: String, status: String) -> Result<bool, String> {
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        let mut sessions_map = sessions.borrow_mut();
        match sessions_map.get_mut(&session_id) {
            Some(session) => {
                session.status = status;
                session.updated_at = ic_cdk::api::time();
                Ok(true)
            }
            None => Err("Session not found".to_string()),
        }
    })
}

// Remove photo from session
#[ic_cdk::update]
fn remove_photo_from_session(session_id: String, photo_url: String) -> Result<bool, String> {
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        let mut sessions_map = sessions.borrow_mut();
        match sessions_map.get_mut(&session_id) {
            Some(session) => {
                session.uploaded_photos.retain(|url| url != &photo_url);
                session.updated_at = ic_cdk::api::time();
                Ok(true)
            }
            None => Err("Session not found".to_string()),
        }
    })
}

// Set S3 config (alias for configure_s3)
#[ic_cdk::update]
fn set_s3_config(config: S3Config) -> bool {
    configure_s3(config)
}

// Get S3 config status
#[ic_cdk::query]
fn get_s3_config_status() -> bool {
    S3_CONFIG.with(|config| config.borrow().is_some())
}

// S3 Configuration
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct S3Config {
    pub bucket_name: String,
    pub region: String,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub endpoint: Option<String>, // For custom S3-compatible services
}

// Global state for S3 configuration
thread_local! {
    static S3_CONFIG: RefCell<Option<S3Config>> = const { RefCell::new(None) };
}

// Configure S3 settings
#[ic_cdk::update]
fn configure_s3(config: S3Config) -> bool {
    S3_CONFIG.with(|s3_config| {
        *s3_config.borrow_mut() = Some(config);
        true
    })
}

// Get S3 configuration (for testing)
#[ic_cdk::query]
fn get_s3_config() -> Option<S3Config> {
    S3_CONFIG.with(|config| config.borrow().clone())
}

export_candid!();
