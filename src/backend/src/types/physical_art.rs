use candid::CandidType;
use serde::{Deserialize, Serialize};

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
