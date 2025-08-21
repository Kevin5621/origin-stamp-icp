use std::cell::RefCell;
use crate::types::{S3Config, UploadFileData};

// Global state for S3 configuration
thread_local! {
    static S3_CONFIG: RefCell<Option<S3Config>> = const { RefCell::new(None) };
}

// Configure S3 settings
#[ic_cdk::update]
pub fn configure_s3(config: S3Config) -> bool {
    S3_CONFIG.with(|s3_config| {
        *s3_config.borrow_mut() = Some(config);
        true
    })
}

// Get S3 configuration (for testing)
#[ic_cdk::query]
pub fn get_s3_config() -> Option<S3Config> {
    S3_CONFIG.with(|config| config.borrow().clone())
}

// Get S3 config status
#[ic_cdk::query]
pub fn get_s3_config_status() -> bool {
    S3_CONFIG.with(|config| config.borrow().is_some())
}

// Set S3 config (alias for configure_s3)
#[ic_cdk::update]
pub fn set_s3_config(config: S3Config) -> bool {
    configure_s3(config)
}

// Generate upload URL using S3 configuration
#[ic_cdk::update]
pub fn generate_upload_url(_session_id: String, file_data: UploadFileData) -> Result<String, String> {
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
