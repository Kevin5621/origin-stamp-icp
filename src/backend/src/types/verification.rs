use candid::CandidType;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct AIVerificationResult {
    pub verification_id: String,
    pub session_id: String,
    pub assets: Vec<AIVerificationAsset>,
    pub status: VerificationStatus,
    pub final_score: f64,     // 0.0 - 100.0
    pub base_similarity: f64, // 0.0 - 1.0
    pub anomaly_count: u32,
    pub breakdown: HashMap<String, f64>, // e.g., {"authenticity": 0.8, "process_steps": 0.6}
    pub model_version: String,
    pub evidence_urls: Vec<String>, // Small thumbnails/captions for evidence
    pub checked_at: u64,
    pub created_at: u64,
    pub notes: Vec<String>, // Admin/manual review notes
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct AIVerificationAsset {
    pub asset_id: String,
    pub s3_url: String,
    pub step_index: usize,
    pub sha256: String,
    pub content_type: String,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum VerificationStatus {
    Pending,
    Verified,
    ReviewNeeded,
    Rejected,
}

// Request types for external worker
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct VerificationRequest {
    pub verification_id: String,
    pub session_id: String,
    pub assets: Vec<AIVerificationAsset>,
    pub callback_url: Option<String>, // For webhook back to canister
}

// Cerebras API integration types
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CerebrasRequest {
    pub model: String,
    pub messages: Vec<CerebrasMessage>,
    pub max_tokens: Option<u32>,
    pub temperature: Option<f64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CerebrasMessage {
    pub role: String, // "user", "assistant", "system"
    pub content: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CerebrasResponse {
    pub choices: Vec<CerebrasChoice>,
    pub usage: Option<CerebrasUsage>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CerebrasChoice {
    pub message: CerebrasMessage,
    pub finish_reason: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CerebrasUsage {
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}
