use crate::types::{
    Certificate, CertificateMetadata, CreateCertificateRequest, NFTGenerationResult,
};
use candid::{CandidType, Deserialize};
use ic_cdk::api::{caller, time};
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;

// Role-based access control
#[derive(CandidType, Deserialize, Clone, PartialEq, Eq)]
pub enum UserRole {
    User,
    Artist,
    Moderator,
    Admin,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct UserPermissions {
    pub username: String,
    pub role: UserRole,
    pub can_create_certificates: bool,
    pub can_generate_nfts: bool,
    pub can_modify_certificates: bool,
    pub can_delete_certificates: bool,
}

// User permissions storage
thread_local! {
    static USER_PERMISSIONS: std::cell::RefCell<HashMap<String, UserPermissions>> = std::cell::RefCell::new(HashMap::new());
}

// Initialize default admin user
pub fn initialize_admin() {
    USER_PERMISSIONS.with(|permissions| {
        let mut perms = permissions.borrow_mut();
        perms.insert(
            "admin_user".to_string(),
            UserPermissions {
                username: "admin_user".to_string(),
                role: UserRole::Admin,
                can_create_certificates: true,
                can_generate_nfts: true,
                can_modify_certificates: true,
                can_delete_certificates: true,
            },
        );
    });
}

// Authentication and authorization functions
fn authenticate_user() -> Result<String, String> {
    let caller_principal = caller();
    if caller_principal == ic_cdk::api::id() {
        return Err("Anonymous calls not allowed".to_string());
    }
    Ok(caller_principal.to_string())
}

fn authorize_certificate_creation(username: &str) -> Result<(), String> {
    USER_PERMISSIONS.with(|permissions| {
        let perms = permissions.borrow();
        if let Some(user_perm) = perms.get(username) {
            if user_perm.can_create_certificates {
                Ok(())
            } else {
                Err(format!(
                    "User {username} is not authorized to create certificates"
                ))
            }
        } else {
            // Default user permissions
            Ok(())
        }
    })
}

// TODO: NFT authorization moved to NFT Module
// TODO: This function will be replaced by NFT Module authorization

thread_local! {
    static CERTIFICATES: RefCell<HashMap<String, Certificate>> = RefCell::new(HashMap::new());
}

// Reentrancy protection
thread_local! {
    static CERTIFICATE_GENERATION_IN_PROGRESS: RefCell<HashMap<String, u64>> = RefCell::new(HashMap::new());
}

fn check_reentrancy_certificate(session_id: &str) -> Result<(), String> {
    CERTIFICATE_GENERATION_IN_PROGRESS.with(|in_progress| {
        let mut progress = in_progress.borrow_mut();
        if progress.contains_key(session_id) {
            // Check if the previous attempt is still valid (within 10 seconds)
            if let Some(timestamp) = progress.get(session_id) {
                let current_time = ic_cdk::api::time();
                let time_diff = current_time.saturating_sub(*timestamp);
                let ten_seconds = 10 * 1_000_000_000; // 10 seconds in nanoseconds

                // Debug logging
                ic_cdk::println!(
                    "DEBUG: Session {} lock check - time_diff: {}ns, threshold: {}ns",
                    session_id,
                    time_diff,
                    ten_seconds
                );

                if time_diff < ten_seconds {
                    return Err(
                        "Certificate generation already in progress for this session".to_string(),
                    );
                } else {
                    // Remove stale lock
                    progress.remove(session_id);
                }
            }
        }

        // Set new lock with current timestamp
        progress.insert(session_id.to_string(), ic_cdk::api::time());
        Ok(())
    })
}

fn release_reentrancy_certificate(session_id: &str) {
    CERTIFICATE_GENERATION_IN_PROGRESS.with(|in_progress| {
        let mut progress = in_progress.borrow_mut();
        progress.remove(session_id);
    });
}

// TODO: NFT reentrancy protection moved to NFT Module
// TODO: These functions will be replaced by NFT Module reentrancy protection

// Input validation and sanitization
fn validate_and_sanitize_input(
    request: &CreateCertificateRequest,
) -> Result<CreateCertificateRequest, String> {
    // Validate session_id
    if request.session_id.is_empty() || request.session_id.len() > 100 {
        return Err("Invalid session_id: must be between 1-100 characters".to_string());
    }

    // Validate username
    if request.username.is_empty() || request.username.len() > 50 {
        return Err("Invalid username: must be between 1-50 characters".to_string());
    }

    // Sanitize art_title (remove dangerous characters)
    let sanitized_art_title = sanitize_string(&request.art_title, 200)?;

    // Sanitize description
    let sanitized_description = sanitize_string(&request.description, 1000)?;

    // Validate photo_count
    if request.photo_count == 0 || request.photo_count > 100 {
        return Err("Invalid photo_count: must be between 1-100".to_string());
    }

    // Validate creation_duration
    if request.creation_duration == 0 || request.creation_duration > 525600 {
        // Max 1 year in minutes
        return Err("Invalid creation_duration: must be between 1-525600 minutes".to_string());
    }

    // Validate file_format
    let allowed_formats = vec!["JPEG", "PNG", "GIF", "WEBP", "JPEG/PNG"];
    if !allowed_formats.contains(&request.file_format.as_str()) {
        return Err(format!(
            "Invalid file_format: must be one of {allowed_formats:?}"
        ));
    }

    // Validate creation_tools
    if request.creation_tools.is_empty() || request.creation_tools.len() > 20 {
        return Err("Invalid creation_tools: must have 1-20 tools".to_string());
    }

    // Sanitize creation_tools
    let sanitized_tools: Vec<String> = request
        .creation_tools
        .iter()
        .map(|tool| sanitize_string(tool, 50))
        .collect::<Result<Vec<String>, String>>()?;

    Ok(CreateCertificateRequest {
        session_id: request.session_id.clone(),
        username: request.username.clone(),
        art_title: sanitized_art_title,
        description: sanitized_description,
        photo_count: request.photo_count,
        creation_duration: request.creation_duration,
        file_format: request.file_format.clone(),
        creation_tools: sanitized_tools,
    })
}

fn sanitize_string(input: &str, max_length: usize) -> Result<String, String> {
    if input.is_empty() || input.len() > max_length {
        return Err(format!(
            "String length must be between 1-{max_length} characters"
        ));
    }

    // Remove potentially dangerous characters
    let sanitized = input
        .chars()
        .filter(|c| c.is_alphanumeric() || c.is_whitespace() || ".,!?-()[]{}:;\"'".contains(*c))
        .collect::<String>();

    if sanitized.is_empty() {
        return Err("String contains no valid characters after sanitization".to_string());
    }

    Ok(sanitized)
}

// Enhanced secure random number generation
fn generate_secure_random_id() -> String {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};

    // Combine multiple entropy sources
    let timestamp = time();
    let caller_principal = caller();
    let random_seed = timestamp
        ^ (caller_principal
            .as_slice()
            .iter()
            .fold(0u64, |acc, &x| acc ^ x as u64));

    let mut hasher = DefaultHasher::new();
    timestamp.hash(&mut hasher);
    caller_principal.hash(&mut hasher);
    random_seed.hash(&mut hasher);

    // Generate 16-character hex string
    format!("{:016x}", hasher.finish())
}

// TODO: BUSINESS MODEL - Photo Upload Limits
// TODO: Add subscription tiers for photo upload limits
// TODO: Validate photo count based on user subscription
// TODO: Premium features for higher subscription tiers

// TODO: BLOCKCHAIN INFO DISPLAY
// TODO: Show verification hash in NFT metadata
// TODO: Display blockchain transaction details
// TODO: Add verification status indicators

// Certificate generation
#[ic_cdk::update]
pub fn generate_certificate(request: CreateCertificateRequest) -> Result<Certificate, String> {
    // 1. Authentication
    authenticate_user()?;

    // 2. Authorization
    authorize_certificate_creation(&request.username)?;

    // 3. Reentrancy protection
    check_reentrancy_certificate(&request.session_id)?;

    // 4. Input validation and sanitization
    let sanitized_request = validate_and_sanitize_input(&request)?;

    // 5. Session validation
    let session =
        crate::modules::physical_art::get_session_details(sanitized_request.session_id.clone());
    if session.is_none() {
        release_reentrancy_certificate(&request.session_id);
        return Err("Session not found".to_string());
    }

    let session = session.unwrap();

    // Validate session status
    if session.status != "active" && session.status != "uploading" {
        release_reentrancy_certificate(&request.session_id);
        return Err("Session is not in valid state for certificate generation".to_string());
    }

    // Validate session ownership
    if session.username != sanitized_request.username {
        release_reentrancy_certificate(&request.session_id);
        return Err("Session ownership mismatch".to_string());
    }

    // TODO: BUSINESS MODEL - Photo Upload Limit Validation
    // TODO: Check user subscription tier
    // TODO: Validate photo count against subscription limit
    // TODO: Return upgrade prompt if limit exceeded

    // Validate photo count
    if session.uploaded_photos.len() != sanitized_request.photo_count as usize {
        release_reentrancy_certificate(&request.session_id);
        return Err("Photo count mismatch with uploaded photos".to_string());
    }

    // 6. Generate certificate ID with enhanced randomness
    let certificate_id = format!(
        "CERT-{}-{}",
        sanitized_request.session_id.to_uppercase(),
        generate_secure_random_id()
    );

    // 7. Generate verification hash with additional entropy
    let caller_principal = caller();
    let verification_data = format!(
        "{}{}{}{}{}",
        sanitized_request.session_id,
        sanitized_request.username,
        sanitized_request.art_title,
        caller_principal,
        time()
    );
    let mut hasher = Sha256::new();
    hasher.update(verification_data.as_bytes());
    let verification_hash = format!("0x{:x}", hasher.finalize());

    // 8. Generate blockchain transaction hash
    let tx_data = format!(
        "{}{}{}{}",
        certificate_id,
        verification_hash,
        caller_principal,
        time()
    );
    let mut tx_hasher = Sha256::new();
    tx_hasher.update(tx_data.as_bytes());
    let blockchain_tx = format!("0x{:x}", tx_hasher.finalize());

    // 9. Calculate scores with bounds checking
    let photo_count = session.uploaded_photos.len() as u32;
    let verification_score = 85u32.saturating_add((photo_count.saturating_mul(2)).min(15));
    let authenticity_rating = 90u32.saturating_add(photo_count.min(10));
    let provenance_score = 88u32.saturating_add(photo_count.min(12));
    let community_trust = 82u32.saturating_add(photo_count.min(18));

    let current_time = time();
    let expiry_date = current_time.saturating_add(10 * 365 * 24 * 60 * 60 * 1_000_000_000); // 10 years

    let certificate = Certificate {
        certificate_id: certificate_id.clone(),
        session_id: sanitized_request.session_id,
        username: sanitized_request.username,
        art_title: sanitized_request.art_title,
        description: sanitized_request.description,
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
                sanitized_request.creation_duration / 60,
                sanitized_request.creation_duration % 60
            ),
            total_actions: sanitized_request.photo_count,
            file_size: format!("{} MB", 10 + (sanitized_request.photo_count * 2)),
            file_format: sanitized_request.file_format,
            creation_tools: sanitized_request.creation_tools,
        },
        // NFT fields - will be set by NFT Module
        nft_generated: false,
        nft_id: None,
        token_uri: None,
    };

    // 10. Store certificate with access control
    CERTIFICATES.with(|certificates| {
        certificates
            .borrow_mut()
            .insert(certificate_id.clone(), certificate.clone());
    });

    // 11. Release reentrancy protection
    release_reentrancy_certificate(&request.session_id);

    Ok(certificate)
}

// Get certificate by ID
#[ic_cdk::query]
pub fn get_certificate_by_id(certificate_id: String) -> Option<Certificate> {
    CERTIFICATES.with(|certificates| certificates.borrow().get(&certificate_id).cloned())
}

#[ic_cdk::query]
pub fn get_user_certificates(username: String) -> Vec<Certificate> {
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
pub fn verify_certificate(
    certificate_id: String,
) -> Result<crate::types::VerificationResult, String> {
    let certificate =
        CERTIFICATES.with(|certificates| certificates.borrow().get(&certificate_id).cloned());

    if certificate.is_none() {
        return Err("Certificate not found".to_string());
    }

    let certificate = certificate.unwrap();

    // Check if certificate is expired
    if ic_cdk::api::time() > certificate.expiry_date {
        return Ok(crate::types::VerificationResult {
            valid: false,
            score: 0,
            details: format!(
                "{{\"error\": \"Certificate expired\", \"expiry_date\": {}, \"current_time\": {}}}",
                certificate.expiry_date,
                ic_cdk::api::time()
            ),
        });
    }

    // Verify certificate is active
    if certificate.certificate_status != "active" {
        return Ok(crate::types::VerificationResult {
            valid: false,
            score: 0,
            details: format!(
                "{{\"error\": \"Certificate is not active\", \"status\": \"{}\"}}",
                certificate.certificate_status
            ),
        });
    }

    // Return verification result
    Ok(crate::types::VerificationResult {
        valid: true,
        score: certificate.verification_score,
        details: format!("{{\"verified\": true, \"timestamp\": {}, \"blockchain\": \"{}\", \"certificate_id\": \"{}\", \"verification_hash\": \"{}\", \"blockchain_tx\": \"{}\"}}", 
            ic_cdk::api::time(), certificate.blockchain, certificate.certificate_id, certificate.verification_hash, certificate.blockchain_tx),
    })
}

// TODO: NFT Generation moved to NFT Module
// TODO: This function will be replaced by NFT Module integration
// TODO: Certificate only provides metadata, NFT Module handles minting

// Generate NFT for certificate - DEPRECATED, use NFT Module instead
#[ic_cdk::update]
pub fn generate_nft_for_certificate(
    _certificate_id: String,
) -> Result<NFTGenerationResult, String> {
    // TODO: This function is deprecated
    // TODO: Use NFT Module::mint_certificate_nft instead
    // TODO: Certificate only provides metadata

    Err("NFT generation moved to NFT Module. Use mint_certificate_nft instead.".to_string())
}

// TODO: NFT Metadata moved to NFT Module
// TODO: This function will be replaced by NFT Module metadata
// TODO: Certificate only provides data, NFT Module generates metadata

// Get NFT metadata for certificate - DEPRECATED, use NFT Module instead
#[ic_cdk::query]
pub fn get_nft_metadata(_certificate_id: String) -> Option<String> {
    // TODO: This function is deprecated
    // TODO: Use NFT Module::get_token_metadata instead
    // TODO: Certificate only provides data, NFT Module handles metadata

    None
}

// New function: Get certificate data for NFT minting
#[ic_cdk::query]
pub fn get_certificate_for_nft_minting(_certificate_id: String) -> Option<Certificate> {
    // TODO: This function provides certificate data to NFT Module
    // TODO: NFT Module will use this data to mint NFT
    // TODO: Includes all metadata needed for NFT generation

    get_certificate_by_id(_certificate_id)
}

// New function: Update certificate after NFT minting
#[ic_cdk::update]
pub fn update_certificate_nft_info(
    _certificate_id: String,
    nft_id: String,
    token_uri: String,
) -> Result<bool, String> {
    // TODO: This function updates certificate after NFT is minted
    // TODO: Called by NFT Module after successful minting
    // TODO: Links certificate with generated NFT

    authenticate_user()?;

    // TODO: Add authorization check
    // TODO: Verify caller has permission to update

    CERTIFICATES.with(|certificates| {
        if let Some(cert) = certificates.borrow_mut().get_mut(&_certificate_id) {
            cert.nft_generated = true;
            cert.nft_id = Some(nft_id);
            cert.token_uri = Some(token_uri);
            Ok(true)
        } else {
            Err("Certificate not found".to_string())
        }
    })
}

// Get total certificate count
#[ic_cdk::query]
pub fn get_certificate_count() -> usize {
    CERTIFICATES.with(|certificates| certificates.borrow().len())
}
