// Main entry point for the backend canister

// Required imports
use ic_cdk::export_candid;

// Module declarations
pub mod modules;
pub mod types;
pub mod utils;

// Re-export NFT module functions for certificate integration
pub use modules::nft::get_certificate_nft_metadata;
pub use modules::nft::mint_certificate_nft;

// Re-export all types needed for Candid interface
pub use types::{
    Account, Certificate, CollectionMetadata, CreateCertificateRequest, LoginResult,
    NFTGenerationResult, PhysicalArtSession, S3Config, Token, TokenMetadata, TransferRequest,
    TransferResponse, UploadFileData, VerificationResult,
};

// Dashboard metrics structure
#[derive(candid::CandidType, serde::Deserialize, Clone, Debug)]
pub struct DashboardMetrics {
    pub total_users: usize,
    pub total_sessions: usize,
    pub total_certificates: usize,
}

// Re-export all public functions from modules for easier access
pub use modules::certificates::*;
pub use modules::nft::*;
pub use modules::physical_art::*;
pub use modules::s3::*;
pub use modules::users::*;

// Get dashboard metrics
#[ic_cdk::query]
pub fn get_dashboard_metrics() -> DashboardMetrics {
    DashboardMetrics {
        total_users: get_user_count(),
        total_sessions: get_session_count(),
        total_certificates: get_certificate_count(),
    }
}

// Export the Candid interface
export_candid!();
