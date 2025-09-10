use crate::types::{
    AIVerificationAsset, AIVerificationResult, VerificationStatus, VerificationUpdateRequest,
};
use crate::utils::generate_random_id;
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    static VERIFICATION_RESULTS: RefCell<HashMap<String, AIVerificationResult>> = RefCell::new(HashMap::new());
    static SESSION_VERIFICATIONS: RefCell<HashMap<String, Vec<String>>> = RefCell::new(HashMap::new());
}

// Create verification request for session
#[ic_cdk::update]
pub fn create_verification_request(
    session_id: String,
    asset_urls: Vec<String>,
) -> Result<String, String> {
    let verification_id = generate_random_id();

    // Create verification assets from URLs
    let assets: Vec<AIVerificationAsset> = asset_urls
        .into_iter()
        .enumerate()
        .map(|(index, url)| AIVerificationAsset {
            asset_id: format!("{verification_id}_{index}"),
            s3_url: url,
            step_index: index,
            sha256: "".to_string(), // Will be computed by worker
            content_type: "image/jpeg".to_string(), // Default, should be detected
        })
        .collect();

    let verification = AIVerificationResult {
        verification_id: verification_id.clone(),
        session_id: session_id.clone(),
        assets,
        status: VerificationStatus::Pending,
        final_score: 0.0,
        base_similarity: 0.0,
        anomaly_count: 0,
        breakdown: HashMap::new(),
        model_version: "cerebras-llama4-scout+openclip".to_string(),
        evidence_urls: Vec::new(),
        checked_at: 0,
        created_at: ic_cdk::api::time(),
        notes: Vec::new(),
    };

    VERIFICATION_RESULTS.with(|results| {
        results
            .borrow_mut()
            .insert(verification_id.clone(), verification);
    });

    // Track verification for session
    SESSION_VERIFICATIONS.with(|session_verifs| {
        session_verifs
            .borrow_mut()
            .entry(session_id)
            .or_default()
            .push(verification_id.clone());
    });

    Ok(verification_id)
}

// Update verification result (called by external worker)
#[ic_cdk::update]
pub fn update_verification_result(request: VerificationUpdateRequest) -> Result<bool, String> {
    VERIFICATION_RESULTS.with(|results| {
        let mut results_map = results.borrow_mut();
        match results_map.get_mut(&request.verification_id) {
            Some(verification) => {
                verification.status = request.status;
                verification.final_score = request.final_score;
                verification.base_similarity = request.base_similarity;
                verification.anomaly_count = request.anomaly_count;
                verification.breakdown = request.breakdown.into_iter().collect();
                verification.evidence_urls = request.evidence_urls;
                verification.notes = request.notes;
                verification.checked_at = ic_cdk::api::time();
                Ok(true)
            }
            None => Err("Verification not found".to_string()),
        }
    })
}

// Get verification result
#[ic_cdk::query]
pub fn get_verification_result(verification_id: String) -> Option<AIVerificationResult> {
    VERIFICATION_RESULTS.with(|results| results.borrow().get(&verification_id).cloned())
}

// Get verification results for session
#[ic_cdk::query]
pub fn get_session_verifications(session_id: String) -> Vec<AIVerificationResult> {
    SESSION_VERIFICATIONS.with(|session_verifs| {
        let session_verification_ids = session_verifs.borrow();
        if let Some(verification_ids) = session_verification_ids.get(&session_id) {
            VERIFICATION_RESULTS.with(|results| {
                let results_map = results.borrow();
                verification_ids
                    .iter()
                    .filter_map(|id| results_map.get(id).cloned())
                    .collect()
            })
        } else {
            Vec::new()
        }
    })
}

// Manual verification override (admin/reviewer)
#[ic_cdk::update]
pub fn manual_verification_override(
    verification_id: String,
    new_status: VerificationStatus,
    reviewer_notes: String,
    adjusted_score: Option<f64>,
) -> Result<bool, String> {
    VERIFICATION_RESULTS.with(|results| {
        let mut results_map = results.borrow_mut();
        match results_map.get_mut(&verification_id) {
            Some(verification) => {
                verification.status = new_status;
                verification
                    .notes
                    .push(format!("MANUAL_OVERRIDE: {reviewer_notes}"));
                if let Some(score) = adjusted_score {
                    verification.final_score = score;
                }
                verification.checked_at = ic_cdk::api::time();
                Ok(true)
            }
            None => Err("Verification not found".to_string()),
        }
    })
}

// Delete verification asset (admin/user)
#[ic_cdk::update]
pub fn delete_verification_asset(
    verification_id: String,
    asset_id: String,
) -> Result<bool, String> {
    VERIFICATION_RESULTS.with(|results| {
        let mut results_map = results.borrow_mut();
        match results_map.get_mut(&verification_id) {
            Some(verification) => {
                verification
                    .assets
                    .retain(|asset| asset.asset_id != asset_id);
                verification.checked_at = ic_cdk::api::time();
                Ok(true)
            }
            None => Err("Verification not found".to_string()),
        }
    })
}

// Get pending verification requests
#[ic_cdk::query]
pub fn get_pending_verifications() -> Vec<AIVerificationResult> {
    VERIFICATION_RESULTS.with(|results| {
        results
            .borrow()
            .values()
            .filter(|v| matches!(v.status, VerificationStatus::Pending))
            .cloned()
            .collect()
    })
}

// Get verification statistics
#[ic_cdk::query]
pub fn get_verification_stats() -> (usize, usize, usize, usize) {
    VERIFICATION_RESULTS.with(|results| {
        let results_map = results.borrow();
        let total = results_map.len();
        let pending = results_map
            .values()
            .filter(|v| matches!(v.status, VerificationStatus::Pending))
            .count();
        let verified = results_map
            .values()
            .filter(|v| matches!(v.status, VerificationStatus::Verified))
            .count();
        let rejected = results_map
            .values()
            .filter(|v| matches!(v.status, VerificationStatus::Rejected))
            .count();
        (total, pending, verified, rejected)
    })
}
