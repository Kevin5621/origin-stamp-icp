use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, CandidType)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub created_at: u64,
}

#[derive(Clone, Debug, CandidType)]
pub struct LoginResult {
    pub success: bool,
    pub message: String,
    pub username: Option<String>,
}

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

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct CertificateMetadata {
    pub creation_duration: String,
    pub total_actions: u32,
    pub file_size: String,
    pub file_format: String,
    pub creation_tools: Vec<String>,
}

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

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct UploadFileData {
    pub filename: String,
    pub content_type: String,
    pub file_size: u64,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct S3Config {
    pub bucket_name: String,
    pub region: String,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub endpoint: Option<String>,
}

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
    pub session_id: Option<String>,
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

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct VerificationResult {
    pub valid: bool,
    pub score: u32,
    pub details: String,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct NFTGenerationResult {
    pub nft_id: String,
    pub token_uri: String,
}
