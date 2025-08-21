// Main entry point for the backend canister

// Required imports
use ic_cdk::export_candid;

// Module declarations
pub mod modules;
pub mod types;
pub mod utils;

// Re-export all public functions from modules for easier access
pub use modules::certificates::*;
pub use modules::nft::*;
pub use modules::physical_art::*;
pub use modules::s3::*;
pub use modules::users::*;

// Export the Candid interface
export_candid!();
