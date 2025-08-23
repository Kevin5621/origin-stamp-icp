use crate::modules::physical_art;
use crate::types::{
    Certificate, CertificateMetadata, CreateCertificateRequest, NFTGenerationResult,
    VerificationResult,
};
use crate::utils::generate_random_id;
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    static CERTIFICATES: RefCell<HashMap<String, Certificate>> = RefCell::new(HashMap::new());
}

// Certificate generation
#[ic_cdk::update]
pub fn generate_certificate(request: CreateCertificateRequest) -> Result<Certificate, String> {
    // Validate input parameters
    if request.session_id.is_empty() {
        return Err("Session ID cannot be empty".to_string());
    }
    if request.username.is_empty() {
        return Err("Username cannot be empty".to_string());
    }
    if request.art_title.is_empty() {
        return Err("Art title cannot be empty".to_string());
    }
    if request.description.is_empty() {
        return Err("Description cannot be empty".to_string());
    }
    if request.photo_count == 0 {
        return Err("Photo count must be greater than 0".to_string());
    }
    if request.creation_duration == 0 {
        return Err("Creation duration must be greater than 0".to_string());
    }
    if request.file_format.is_empty() {
        return Err("File format cannot be empty".to_string());
    }
    if request.creation_tools.is_empty() {
        return Err("Creation tools cannot be empty".to_string());
    }

    // Get session details
    let session = physical_art::get_session_details(request.session_id.clone());

    if session.is_none() {
        return Err("Session not found".to_string());
    }

    let session = session.unwrap();

    // Validate session status
    if session.status != "active" && session.status != "uploading" {
        return Err("Session is not in valid state for certificate generation".to_string());
    }

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
pub fn verify_certificate(certificate_id: String) -> Result<VerificationResult, String> {
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
pub fn generate_nft_for_certificate(certificate_id: String) -> Result<NFTGenerationResult, String> {
    // Validate input
    if certificate_id.is_empty() {
        return Err("Certificate ID cannot be empty".to_string());
    }

    let certificate =
        CERTIFICATES.with(|certificates| certificates.borrow().get(&certificate_id).cloned());

    if certificate.is_none() {
        return Err("Certificate not found".to_string());
    }

    let certificate = certificate.unwrap();

    // Validate certificate status
    if certificate.certificate_status != "active" {
        return Err("Certificate is not active".to_string());
    }

    // Generate NFT ID
    let nft_id = format!("NFT-{}-{}", certificate_id, generate_random_id());

    // Create NFT metadata URI
    let token_uri = format!("https://ic-vibe.ic0.app/nft/{certificate_id}/metadata");

    Ok(NFTGenerationResult { 
        nft_id, 
        token_uri
    })
}

// Get NFT metadata for certificate
#[ic_cdk::query]
pub fn get_nft_metadata(certificate_id: String) -> Option<String> {
    if certificate_id.is_empty() {
        return None;
    }

    let certificate =
        CERTIFICATES.with(|certificates| certificates.borrow().get(&certificate_id).cloned());

    if certificate.is_none() {
        return None;
    }

    let certificate = certificate.unwrap();

    // Generate NFT metadata with certificate information
    let nft_metadata = format!(
        r#"{{
            "name": "IC-Vibe Certificate NFT - {}",
            "description": "Digital certificate for artwork: {}",
            "image": "https://ic-vibe.ic0.app/certificate/{}/image",
            "attributes": [
                {{
                    "trait_type": "Certificate ID",
                    "value": "{}"
                }},
                {{
                    "trait_type": "Art Title",
                    "value": "{}"
                }},
                {{
                    "trait_type": "Artist",
                    "value": "{}"
                }},
                {{
                    "trait_type": "Verification Score",
                    "value": {}
                }},
                {{
                    "trait_type": "Authenticity Rating",
                    "value": {}
                }},
                {{
                    "trait_type": "Creation Duration",
                    "value": "{}"
                }},
                {{
                    "trait_type": "Issue Date",
                    "value": "{}"
                }},
                {{
                    "trait_type": "Blockchain",
                    "value": "{}"
                }}
            ],
            "external_url": "{}",
            "verification_hash": "{}"
        }}"#,
        certificate.art_title,
        certificate.art_title,
        certificate_id,
        certificate_id,
        certificate.art_title,
        certificate.username,
        certificate.verification_score,
        certificate.authenticity_rating,
        certificate.metadata.creation_duration,
        certificate.issue_date,
        certificate.blockchain,
        certificate.verification_url,
        certificate.verification_hash
    );

    Some(nft_metadata)
}

// Get total certificate count
#[ic_cdk::query]
pub fn get_certificate_count() -> usize {
    CERTIFICATES.with(|certificates| certificates.borrow().len())
}
