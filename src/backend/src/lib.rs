use candid::CandidType;
use ic_cdk::export_candid;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
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
fn generate_upload_url(_session_id: String, file_data: UploadFileData) -> Result<String, String> {
    S3_CONFIG.with(|config| {
        match config.borrow().as_ref() {
            Some(s3_config) => {
                let base_url = match &s3_config.endpoint {
                    Some(endpoint) => {
                        // Remove trailing slash from endpoint if present
                        let endpoint = endpoint.trim_end_matches('/');
                        format!("{}/{}", endpoint, s3_config.bucket_name)
                    }
                    None => format!(
                        "https://{}.s3.{}.amazonaws.com",
                        s3_config.bucket_name, s3_config.region
                    ),
                };

                // Generate S3 object URL (without session ID in path)
                let object_key = file_data.filename;
                Ok(format!("{base_url}/{object_key}"))
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

// =============================================================================
// ICRC-7 NFT Implementation
// =============================================================================

// ICRC-7 standard types
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Account {
    pub owner: candid::Principal,
    pub subaccount: Option<Vec<u8>>,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct TokenMetadata {
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub attributes: Vec<(String, String)>,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Token {
    pub id: u64,
    pub owner: Account,
    pub metadata: TokenMetadata,
    pub created_at: u64,
    pub session_id: Option<String>, // Link to physical art session
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct TransferRequest {
    pub from: Account,
    pub to: Account,
    pub token_id: u64,
    pub memo: Option<Vec<u8>>,
    pub created_at_time: Option<u64>,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct TransferResponse {
    pub token_id: u64,
    pub result: Result<(), String>,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct CollectionMetadata {
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub total_supply: u64,
    pub max_supply: Option<u64>,
}

// NFT storage
thread_local! {
    static TOKENS: RefCell<HashMap<u64, Token>> = RefCell::new(HashMap::new());
    static TOKEN_COUNTER: RefCell<u64> = RefCell::new(1);
    static COLLECTION_METADATA: RefCell<CollectionMetadata> = RefCell::new(CollectionMetadata {
        name: "Origin Stamp Art NFTs".to_string(),
        description: Some("NFTs representing physical art pieces authenticated through Origin Stamp".to_string()),
        image: None,
        total_supply: 0,
        max_supply: None,
    });
}

// Helper functions
impl Account {
    fn equals(&self, other: &Account) -> bool {
        self.owner == other.owner && self.subaccount == other.subaccount
    }
}

fn generate_token_hash(token_id: u64, session_id: &str, timestamp: u64) -> String {
    let mut hasher = Sha256::new();
    hasher.update(token_id.to_be_bytes());
    hasher.update(session_id.as_bytes());
    hasher.update(timestamp.to_be_bytes());
    format!("{:x}", hasher.finalize())
}

// ICRC-7 Standard Methods

// icrc7_collection_metadata - Returns collection metadata
#[ic_cdk::query]
fn icrc7_collection_metadata() -> CollectionMetadata {
    COLLECTION_METADATA.with(|metadata| metadata.borrow().clone())
}

// icrc7_name - Returns the name of the NFT collection
#[ic_cdk::query]
fn icrc7_name() -> String {
    COLLECTION_METADATA.with(|metadata| metadata.borrow().name.clone())
}

// icrc7_description - Returns the description of the NFT collection
#[ic_cdk::query]
fn icrc7_description() -> Option<String> {
    COLLECTION_METADATA.with(|metadata| metadata.borrow().description.clone())
}

// icrc7_total_supply - Returns the total number of tokens
#[ic_cdk::query]
fn icrc7_total_supply() -> u64 {
    TOKENS.with(|tokens| tokens.borrow().len() as u64)
}

// icrc7_supply_cap - Returns the maximum supply (if any)
#[ic_cdk::query]
fn icrc7_supply_cap() -> Option<u64> {
    COLLECTION_METADATA.with(|metadata| metadata.borrow().max_supply)
}

// icrc7_tokens - Returns a list of token IDs (paginated)
#[ic_cdk::query]
fn icrc7_tokens(prev: Option<u64>, take: Option<u64>) -> Vec<u64> {
    let take = take.unwrap_or(100).min(1000); // Limit to 1000 per request

    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        let mut token_ids: Vec<u64> = tokens_map.keys().cloned().collect();
        token_ids.sort();

        let start_index = match prev {
            Some(prev_id) => match token_ids.binary_search(&prev_id) {
                Ok(idx) => idx + 1,
                Err(idx) => idx,
            },
            None => 0,
        };

        token_ids
            .into_iter()
            .skip(start_index)
            .take(take as usize)
            .collect()
    })
}

// icrc7_owner_of - Returns the owner of tokens
#[ic_cdk::query]
fn icrc7_owner_of(token_ids: Vec<u64>) -> Vec<Option<Account>> {
    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        token_ids
            .into_iter()
            .map(|id| tokens_map.get(&id).map(|token| token.owner.clone()))
            .collect()
    })
}

// icrc7_balance_of - Returns the balance of tokens for accounts
#[ic_cdk::query]
fn icrc7_balance_of(accounts: Vec<Account>) -> Vec<u64> {
    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        accounts
            .into_iter()
            .map(|account| {
                tokens_map
                    .values()
                    .filter(|token| token.owner.equals(&account))
                    .count() as u64
            })
            .collect()
    })
}

// icrc7_tokens_of - Returns token IDs owned by accounts
#[ic_cdk::query]
fn icrc7_tokens_of(account: Account, prev: Option<u64>, take: Option<u64>) -> Vec<u64> {
    let take = take.unwrap_or(100).min(1000);

    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        let mut owned_tokens: Vec<u64> = tokens_map
            .iter()
            .filter(|(_, token)| token.owner.equals(&account))
            .map(|(id, _)| *id)
            .collect();
        owned_tokens.sort();

        let start_index = match prev {
            Some(prev_id) => match owned_tokens.binary_search(&prev_id) {
                Ok(idx) => idx + 1,
                Err(idx) => idx,
            },
            None => 0,
        };

        owned_tokens
            .into_iter()
            .skip(start_index)
            .take(take as usize)
            .collect()
    })
}

// icrc7_token_metadata - Returns metadata for tokens
#[ic_cdk::query]
fn icrc7_token_metadata(token_ids: Vec<u64>) -> Vec<Option<TokenMetadata>> {
    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        token_ids
            .into_iter()
            .map(|id| tokens_map.get(&id).map(|token| token.metadata.clone()))
            .collect()
    })
}

// icrc7_transfer - Transfer tokens between accounts
#[ic_cdk::update]
fn icrc7_transfer(requests: Vec<TransferRequest>) -> Vec<TransferResponse> {
    let caller = ic_cdk::api::caller();

    TOKENS.with(|tokens| {
        let mut tokens_map = tokens.borrow_mut();

        requests
            .into_iter()
            .map(|request| {
                // Verify caller is the owner or has permission
                if request.from.owner != caller {
                    return TransferResponse {
                        token_id: request.token_id,
                        result: Err("Unauthorized: caller is not the owner".to_string()),
                    };
                }

                match tokens_map.get_mut(&request.token_id) {
                    Some(token) => {
                        if !token.owner.equals(&request.from) {
                            TransferResponse {
                                token_id: request.token_id,
                                result: Err("Token not owned by from account".to_string()),
                            }
                        } else {
                            token.owner = request.to.clone();
                            TransferResponse {
                                token_id: request.token_id,
                                result: Ok(()),
                            }
                        }
                    }
                    None => TransferResponse {
                        token_id: request.token_id,
                        result: Err("Token not found".to_string()),
                    },
                }
            })
            .collect()
    })
}

// Custom functions for Origin Stamp integration

// Mint NFT from physical art session
#[ic_cdk::update]
fn mint_nft_from_session(
    session_id: String,
    recipient: Account,
    additional_attributes: Vec<(String, String)>,
) -> Result<u64, String> {
    let _caller = ic_cdk::api::caller();

    // Get session details
    let session =
        PHYSICAL_ART_SESSIONS.with(|sessions| sessions.borrow().get(&session_id).cloned());

    let session = match session {
        Some(s) => s,
        None => return Err("Session not found".to_string()),
    };

    // Only session owner can mint NFT (or implement admin logic)
    // For now, anyone can mint (you might want to add authorization)

    let token_id = TOKEN_COUNTER.with(|counter| {
        let mut counter_val = counter.borrow_mut();
        let id = *counter_val;
        *counter_val += 1;
        id
    });

    let current_time = ic_cdk::api::time();
    let token_hash = generate_token_hash(token_id, &session_id, current_time);

    // Create metadata with session information
    let mut attributes = vec![
        ("session_id".to_string(), session_id.clone()),
        ("artist".to_string(), session.username.clone()),
        ("art_title".to_string(), session.art_title.clone()),
        ("created_at".to_string(), current_time.to_string()),
        ("token_hash".to_string(), token_hash),
        (
            "photo_count".to_string(),
            session.uploaded_photos.len().to_string(),
        ),
    ];

    // Add additional attributes
    attributes.extend(additional_attributes);

    // Add photo URLs as attributes if available
    for (i, photo_url) in session.uploaded_photos.iter().enumerate() {
        attributes.push((format!("photo_{}", i + 1), photo_url.clone()));
    }

    let metadata = TokenMetadata {
        name: format!("{} - #{}", session.art_title, token_id),
        description: Some(session.description.clone()),
        image: session.uploaded_photos.first().cloned(), // Use first photo as main image
        attributes,
    };

    let token = Token {
        id: token_id,
        owner: recipient,
        metadata,
        created_at: current_time,
        session_id: Some(session_id),
    };

    TOKENS.with(|tokens| {
        tokens.borrow_mut().insert(token_id, token);
    });

    // Update collection total supply
    COLLECTION_METADATA.with(|metadata| {
        let mut collection = metadata.borrow_mut();
        collection.total_supply += 1;
    });

    Ok(token_id)
}

// Get NFTs associated with a session
#[ic_cdk::query]
fn get_session_nfts(session_id: String) -> Vec<Token> {
    TOKENS.with(|tokens| {
        tokens
            .borrow()
            .values()
            .filter(|token| token.session_id.as_ref() == Some(&session_id))
            .cloned()
            .collect()
    })
}

// Get all NFTs owned by a user (by principal)
#[ic_cdk::query]
fn get_user_nfts(owner: candid::Principal) -> Vec<Token> {
    TOKENS.with(|tokens| {
        tokens
            .borrow()
            .values()
            .filter(|token| token.owner.owner == owner)
            .cloned()
            .collect()
    })
}

// Update collection metadata (admin function)
#[ic_cdk::update]
fn update_collection_metadata(
    name: String,
    description: Option<String>,
    image: Option<String>,
    max_supply: Option<u64>,
) -> Result<bool, String> {
    // You might want to add admin authorization here
    COLLECTION_METADATA.with(|metadata| {
        let mut collection = metadata.borrow_mut();
        collection.name = name;
        collection.description = description;
        collection.image = image;
        collection.max_supply = max_supply;
    });
    Ok(true)
}

// Get token details (extended information)
#[ic_cdk::query]
fn get_token_details(token_id: u64) -> Option<Token> {
    TOKENS.with(|tokens| tokens.borrow().get(&token_id).cloned())
}

export_candid!();
