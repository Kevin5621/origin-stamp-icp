use candid::CandidType;
use serde::{Deserialize, Serialize};

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
    pub nft_generated: bool,
    pub nft_id: Option<String>,
    pub token_uri: Option<String>,
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
pub struct VerificationResult {
    pub valid: bool,
    pub score: u32,
    pub details: String,
}
