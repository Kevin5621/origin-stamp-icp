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

// Certificate structure
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Certificate {
    pub certificate_id: String,
    pub session_id: String,
    pub username: String,
    pub art_title: String,
    pub description: String,
    pub issue_date: u64,
    pub expiry_date: u64,
    pub verification_hash: String,
    pub blockchain_tx: String,
    pub qr_code_data: String,
    pub verification_url: String,
    pub certificate_type: String,
    pub verification_score: u32,
    pub authenticity_rating: u32,
    pub provenance_score: u32,
    pub community_trust: u32,
    pub certificate_status: String,
    pub issuer: String,
    pub blockchain: String,
    pub token_standard: String,
    pub metadata: CertificateMetadata,
}

// Certificate metadata structure
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct CertificateMetadata {
    pub creation_duration: String,
    pub total_actions: u32,
    pub file_size: String,
    pub file_format: String,
    pub creation_tools: Vec<String>,
}

// Certificate generation request
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct CreateCertificateRequest {
    pub session_id: String,
    pub username: String,
    pub art_title: String,
    pub description: String,
    pub photo_count: u32,
    pub creation_duration: u32,
    pub file_format: String,
    pub creation_tools: Vec<String>,
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
    static CERTIFICATES: RefCell<HashMap<String, Certificate>> = RefCell::new(HashMap::new());
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
    static TOKEN_COUNTER: RefCell<u64> = const { RefCell::new(1) };
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

// Certificate generation
#[ic_cdk::update]
fn generate_certificate(request: CreateCertificateRequest) -> Result<Certificate, String> {
    // Validate session exists
    let session =
        PHYSICAL_ART_SESSIONS.with(|sessions| sessions.borrow().get(&request.session_id).cloned());

    if session.is_none() {
        return Err("Session not found".to_string());
    }

    let session = session.unwrap();

    // Generate certificate ID
    let certificate_id = format!(
        "CERT-{}-{}",
        request.session_id.to_uppercase(),
        generate_random_id()
    );

    // Generate verification hash
    let verification_data = format!(
        "{}{}{}{}",
        request.session_id,
        request.username,
        request.art_title,
        ic_cdk::api::time()
    );
    let mut hasher = Sha256::new();
    hasher.update(verification_data.as_bytes());
    let verification_hash = format!("0x{:x}", hasher.finalize());

    // Generate blockchain transaction hash
    let tx_data = format!(
        "{}{}{}",
        certificate_id,
        verification_hash,
        ic_cdk::api::time()
    );
    let mut tx_hasher = Sha256::new();
    tx_hasher.update(tx_data.as_bytes());
    let blockchain_tx = format!("0x{:x}", tx_hasher.finalize());

    // Calculate scores based on session data
    let verification_score = 85 + (session.uploaded_photos.len() as u32 * 2).min(15);
    let authenticity_rating = 90 + (session.uploaded_photos.len() as u32).min(10);
    let provenance_score = 88 + (session.uploaded_photos.len() as u32).min(12);
    let community_trust = 82 + (session.uploaded_photos.len() as u32).min(18);

    let current_time = ic_cdk::api::time();
    let expiry_date = current_time + (10 * 365 * 24 * 60 * 60 * 1_000_000_000); // 10 years

    let certificate = Certificate {
        certificate_id: certificate_id.clone(),
        session_id: request.session_id,
        username: request.username,
        art_title: request.art_title,
        description: request.description,
        issue_date: current_time,
        expiry_date,
        verification_hash,
        blockchain_tx,
        qr_code_data: format!("https://ic-vibe.ic0.app/verify/{certificate_id}"),
        verification_url: format!("https://ic-vibe.ic0.app/verify/{certificate_id}"),
        certificate_type: "standard".to_string(),
        verification_score,
        authenticity_rating,
        provenance_score,
        community_trust,
        certificate_status: "active".to_string(),
        issuer: "IC-Vibe Creative Platform".to_string(),
        blockchain: "Internet Computer".to_string(),
        token_standard: "ICP-721".to_string(),
        metadata: CertificateMetadata {
            creation_duration: format!(
                "{} hours {} minutes",
                request.creation_duration / 60,
                request.creation_duration % 60
            ),
            total_actions: request.photo_count,
            file_size: format!("{} MB", 10 + (request.photo_count * 2)),
            file_format: request.file_format,
            creation_tools: request.creation_tools,
        },
    };

    // Store certificate
    CERTIFICATES.with(|certificates| {
        certificates
            .borrow_mut()
            .insert(certificate_id.clone(), certificate.clone());
    });

    Ok(certificate)
}

// Get certificate by ID
#[ic_cdk::query]
fn get_certificate_by_id(certificate_id: String) -> Option<Certificate> {
    CERTIFICATES.with(|certificates| certificates.borrow().get(&certificate_id).cloned())
}

// Get certificates for user
#[ic_cdk::query]
fn get_user_certificates(username: String) -> Vec<Certificate> {
    CERTIFICATES.with(|certificates| {
        certificates
            .borrow()
            .values()
            .filter(|cert| cert.username == username)
            .cloned()
            .collect()
    })
}

// Verify certificate
#[ic_cdk::update]
fn verify_certificate(certificate_id: String) -> Result<VerificationResult, String> {
    let certificate =
        CERTIFICATES.with(|certificates| certificates.borrow().get(&certificate_id).cloned());

    if certificate.is_none() {
        return Err("Certificate not found".to_string());
    }

    let certificate = certificate.unwrap();
    let current_time = ic_cdk::api::time();

    // Check if certificate is expired
    if current_time > certificate.expiry_date {
        return Ok(VerificationResult {
            valid: false,
            score: 0,
            details: format!(
                "{{\"error\": \"Certificate expired\", \"expiry_date\": {}, \"current_time\": {}}}",
                certificate.expiry_date, current_time
            ),
        });
    }

    // Verify certificate is active
    if certificate.certificate_status != "active" {
        return Ok(VerificationResult {
            valid: false,
            score: 0,
            details: format!(
                "{{\"error\": \"Certificate is not active\", \"status\": \"{}\"}}",
                certificate.certificate_status
            ),
        });
    }

    // Return verification result
    Ok(VerificationResult {
        valid: true,
        score: certificate.verification_score,
        details: format!("{{\"verified\": true, \"timestamp\": {}, \"blockchain\": \"{}\", \"certificate_id\": \"{}\", \"verification_hash\": \"{}\", \"blockchain_tx\": \"{}\"}}", 
            current_time, certificate.blockchain, certificate.certificate_id, certificate.verification_hash, certificate.blockchain_tx),
    })
}

// Generate NFT for certificate
#[ic_cdk::update]
fn generate_nft_for_certificate(certificate_id: String) -> Result<NFTGenerationResult, String> {
    let certificate =
        CERTIFICATES.with(|certificates| certificates.borrow().get(&certificate_id).cloned());

    if certificate.is_none() {
        return Err("Certificate not found".to_string());
    }

    let _certificate = certificate.unwrap();

    // Generate NFT ID
    let nft_id = format!("NFT-{}-{}", certificate_id, generate_random_id());

    // Create NFT metadata
    let token_uri = format!("https://ic-vibe.ic0.app/nft/{certificate_id}");

    Ok(NFTGenerationResult { nft_id, token_uri })
}

// Verification result structure
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct VerificationResult {
    pub valid: bool,
    pub score: u32,
    pub details: String,
}

// NFT generation result structure
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct NFTGenerationResult {
    pub nft_id: String,
    pub token_uri: String,
}

export_candid!();
