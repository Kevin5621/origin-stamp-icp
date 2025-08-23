use crate::modules::physical_art;
use crate::types::{
    Account, CollectionMetadata, Token, TokenAttribute, TokenMetadata, TransferRequest,
    TransferResponse,
};
use serde_json;
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::HashMap;

// =============================================================================
// ICRC-7 NFT Implementation
// =============================================================================

// NFT storage
thread_local! {
    static TOKENS: RefCell<HashMap<u64, Token>> = RefCell::new(HashMap::new());
    static TOKEN_COUNTER: RefCell<u64> = const { RefCell::new(1) };
    static COLLECTION_METADATA: RefCell<CollectionMetadata> = RefCell::new(CollectionMetadata {
        name: "Origin Stamp Art NFTs".to_string(),
        description: Some("NFTs representing physical art pieces authenticated through Origin Stamp".to_string()),
        image: None,
        total_supply: 0,
        max_supply: None,
    });
}

// Helper functions
impl Account {
    pub fn equals(&self, other: &Account) -> bool {
        self.owner == other.owner && self.subaccount == other.subaccount
    }
}

// ICRC-7 Standard Methods

// icrc7_collection_metadata - Returns collection metadata
#[ic_cdk::query]
pub fn icrc7_collection_metadata() -> CollectionMetadata {
    COLLECTION_METADATA.with(|metadata| metadata.borrow().clone())
}

// icrc7_name - Returns the name of the NFT collection
#[ic_cdk::query]
pub fn icrc7_name() -> String {
    COLLECTION_METADATA.with(|metadata| metadata.borrow().name.clone())
}

// icrc7_description - Returns the description of the NFT collection
#[ic_cdk::query]
pub fn icrc7_description() -> Option<String> {
    COLLECTION_METADATA.with(|metadata| metadata.borrow().description.clone())
}

// icrc7_total_supply - Returns the total number of tokens
#[ic_cdk::query]
pub fn icrc7_total_supply() -> u64 {
    TOKENS.with(|tokens| tokens.borrow().len() as u64)
}

// icrc7_supply_cap - Returns the maximum supply (if any)
#[ic_cdk::query]
pub fn icrc7_supply_cap() -> Option<u64> {
    COLLECTION_METADATA.with(|metadata| metadata.borrow().max_supply)
}

// icrc7_tokens - Returns a list of token IDs (paginated)
#[ic_cdk::query]
pub fn icrc7_tokens(prev: Option<u64>, take: Option<u64>) -> Vec<u64> {
    let take = take.unwrap_or(100).min(1000); // Limit to 1000 per request

    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        let mut token_ids: Vec<u64> = tokens_map.keys().cloned().collect();
        token_ids.sort();

        let start_index = match prev {
            Some(prev_id) => match token_ids.binary_search(&prev_id) {
                Ok(idx) => idx + 1,
                Err(idx) => idx,
            },
            None => 0,
        };

        token_ids
            .into_iter()
            .skip(start_index)
            .take(take as usize)
            .collect()
    })
}

// icrc7_owner_of - Returns the owner of tokens
#[ic_cdk::query]
pub fn icrc7_owner_of(token_ids: Vec<u64>) -> Vec<Option<Account>> {
    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        token_ids
            .into_iter()
            .map(|id| tokens_map.get(&id).map(|token| token.owner.clone()))
            .collect()
    })
}

// icrc7_balance_of - Returns the balance of tokens for accounts
#[ic_cdk::query]
pub fn icrc7_balance_of(accounts: Vec<Account>) -> Vec<u64> {
    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        accounts
            .into_iter()
            .map(|account| {
                tokens_map
                    .values()
                    .filter(|token| token.owner.equals(&account))
                    .count() as u64
            })
            .collect()
    })
}

// icrc7_tokens_of - Returns token IDs owned by accounts
#[ic_cdk::query]
pub fn icrc7_tokens_of(account: Account, prev: Option<u64>, take: Option<u64>) -> Vec<u64> {
    let take = take.unwrap_or(100).min(1000);

    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        let mut owned_tokens: Vec<u64> = tokens_map
            .iter()
            .filter(|(_, token)| token.owner.equals(&account))
            .map(|(id, _)| *id)
            .collect();
        owned_tokens.sort();

        let start_index = match prev {
            Some(prev_id) => match owned_tokens.binary_search(&prev_id) {
                Ok(idx) => idx + 1,
                Err(idx) => idx,
            },
            None => 0,
        };

        owned_tokens
            .into_iter()
            .skip(start_index)
            .take(take as usize)
            .collect()
    })
}

// icrc7_token_metadata - Returns metadata for tokens
#[ic_cdk::query]
pub fn icrc7_token_metadata(token_ids: Vec<u64>) -> Vec<Option<TokenMetadata>> {
    TOKENS.with(|tokens| {
        let tokens_map = tokens.borrow();
        token_ids
            .into_iter()
            .map(|id| tokens_map.get(&id).map(|token| token.metadata.clone()))
            .collect()
    })
}

// icrc7_transfer - Transfer tokens between accounts
#[ic_cdk::update]
pub fn icrc7_transfer(requests: Vec<TransferRequest>) -> Vec<TransferResponse> {
    let caller = ic_cdk::api::caller();

    TOKENS.with(|tokens| {
        let mut tokens_map = tokens.borrow_mut();

        requests
            .into_iter()
            .map(|request| {
                // Verify caller is the owner or has permission
                if request.from.owner != caller {
                    return TransferResponse {
                        token_id: request.token_id,
                        result: Err("Unauthorized: caller is not the owner".to_string()),
                    };
                }

                match tokens_map.get_mut(&request.token_id) {
                    Some(token) => {
                        if !token.owner.equals(&request.from) {
                            TransferResponse {
                                token_id: request.token_id,
                                result: Err("Token not owned by from account".to_string()),
                            }
                        } else {
                            token.owner = request.to.clone();
                            TransferResponse {
                                token_id: request.token_id,
                                result: Ok(()),
                            }
                        }
                    }
                    None => TransferResponse {
                        token_id: request.token_id,
                        result: Err("Token not found".to_string()),
                    },
                }
            })
            .collect()
    })
}

// Custom functions for Origin Stamp integration

// Mint NFT from physical art session
#[ic_cdk::update]
pub fn mint_nft_from_session(
    session_id: String,
    recipient: Account,
    additional_attributes: Vec<(String, String)>,
) -> Result<u64, String> {
    let _caller = ic_cdk::api::caller();

    // Get session details
    let session = physical_art::get_session_details(session_id.clone());

    let session = match session {
        Some(s) => s,
        None => return Err("Session not found".to_string()),
    };

    // Only session owner can mint NFT (or implement admin logic)
    // For now, anyone can mint (you might want to add authorization)

    let token_id = TOKEN_COUNTER.with(|counter| {
        let mut counter_val = counter.borrow_mut();
        let id = *counter_val;
        *counter_val += 1;
        id
    });

    let current_time = ic_cdk::api::time();
    let token_hash = generate_token_hash(token_id, &session_id, current_time);

    // Create metadata with session information
    let mut attributes = vec![
        TokenAttribute {
            trait_type: "session_id".to_string(),
            value: session_id.clone(),
        },
        TokenAttribute {
            trait_type: "artist".to_string(),
            value: session.username.clone(),
        },
        TokenAttribute {
            trait_type: "art_title".to_string(),
            value: session.art_title.clone(),
        },
        TokenAttribute {
            trait_type: "created_at".to_string(),
            value: current_time.to_string(),
        },
        TokenAttribute {
            trait_type: "token_hash".to_string(),
            value: token_hash,
        },
        TokenAttribute {
            trait_type: "photo_count".to_string(),
            value: session.uploaded_photos.len().to_string(),
        },
    ];

    // Add additional attributes
    for (key, value) in additional_attributes {
        attributes.push(TokenAttribute {
            trait_type: key,
            value,
        });
    }

    // Add photo URLs as attributes if available
    for (i, photo_url) in session.uploaded_photos.iter().enumerate() {
        attributes.push(TokenAttribute {
            trait_type: format!("photo_{}", i + 1),
            value: photo_url.clone(),
        });
    }

    let metadata = TokenMetadata {
        name: format!("{} - #{}", session.art_title, token_id),
        description: Some(session.description.clone()),
        image: session.uploaded_photos.first().cloned(), // Use first photo as main image
        attributes,
    };

    let token = Token {
        id: token_id,
        owner: recipient,
        metadata,
        created_at: current_time,
        session_id: Some(session_id),
    };

    TOKENS.with(|tokens| {
        tokens.borrow_mut().insert(token_id, token);
    });

    // Update collection total supply
    COLLECTION_METADATA.with(|metadata| {
        let mut collection = metadata.borrow_mut();
        collection.total_supply += 1;
    });

    Ok(token_id)
}

// Get NFTs associated with a session
#[ic_cdk::query]
pub fn get_session_nfts(session_id: String) -> Vec<Token> {
    TOKENS.with(|tokens| {
        tokens
            .borrow()
            .values()
            .filter(|token| token.session_id.as_ref() == Some(&session_id))
            .cloned()
            .collect()
    })
}

// Get all NFTs owned by a user (by principal)
#[ic_cdk::query]
pub fn get_user_nfts(owner: candid::Principal) -> Vec<Token> {
    TOKENS.with(|tokens| {
        tokens
            .borrow()
            .values()
            .filter(|token| token.owner.owner == owner)
            .cloned()
            .collect()
    })
}

// Update collection metadata (admin function)
#[ic_cdk::update]
pub fn update_collection_metadata(
    name: String,
    description: Option<String>,
    image: Option<String>,
    max_supply: Option<u64>,
) -> Result<bool, String> {
    // You might want to add admin authorization here
    COLLECTION_METADATA.with(|metadata| {
        let mut collection = metadata.borrow_mut();
        collection.name = name;
        collection.description = description;
        collection.image = image;
        collection.max_supply = max_supply;
    });
    Ok(true)
}

// Get token details (extended information)
#[ic_cdk::query]
pub fn get_token_details(token_id: u64) -> Option<Token> {
    TOKENS.with(|tokens| tokens.borrow().get(&token_id).cloned())
}

// TODO: CERTIFICATE NFT INTEGRATION
// TODO: This function mints NFT from certificate data
// TODO: Integrates with certificate module for metadata

// Mint NFT from certificate
#[ic_cdk::update]
pub fn mint_certificate_nft(certificate_id: String, recipient: Account) -> Result<u64, String> {
    let _caller = ic_cdk::api::caller();

    // 1. Input validation
    if certificate_id.is_empty() || certificate_id.len() > 100 {
        return Err("Invalid certificate ID".to_string());
    }

    // 2. Get certificate data from certificate module
    let certificate =
        crate::modules::certificates::get_certificate_for_nft_minting(certificate_id.clone());
    if certificate.is_none() {
        return Err("Certificate not found".to_string());
    }
    let certificate = certificate.unwrap();

    // 3. Verify certificate is active
    if certificate.certificate_status != "active" {
        return Err("Certificate is not active".to_string());
    }

    // 4. Check if NFT already exists
    if certificate.nft_generated {
        return Err("NFT already generated for this certificate".to_string());
    }

    // 5. Validate subscription tier for NFT generation
    let user_subscription =
        crate::modules::certificates::get_user_subscription(certificate.username.clone());
    match user_subscription {
        Some(tier) => {
            let subscription_limits = tier.get_limits();

            if !subscription_limits.can_generate_nft {
                return Err(format!(
                    "NFT generation not allowed for {tier:?} tier. Upgrade to Basic tier or higher to generate NFTs."
                ));
            }
        }
        None => {
            // Default to Free tier if no subscription found
            return Err("NFT generation not allowed for Free tier. Upgrade to Basic tier or higher to generate NFTs.".to_string());
        }
    }

    // 6. Get session details for progress photos
    let session = crate::modules::physical_art::get_session_details(certificate.session_id.clone());
    if session.is_none() {
        return Err("Session not found for NFT generation".to_string());
    }
    let session = session.unwrap();

    // 7. Generate token ID
    let token_id = TOKEN_COUNTER.with(|counter| {
        let mut counter_val = counter.borrow_mut();
        let id = *counter_val;
        *counter_val += 1;
        id
    });

    // 8. Generate token hash
    let current_time = ic_cdk::api::time();
    let token_hash = generate_token_hash(token_id, &certificate.session_id, current_time);

    // 9. Create comprehensive metadata with certificate info
    let mut attributes = vec![
        // Basic certificate info
        TokenAttribute {
            trait_type: "certificate_id".to_string(),
            value: certificate.certificate_id.clone(),
        },
        TokenAttribute {
            trait_type: "art_title".to_string(),
            value: certificate.art_title.clone(),
        },
        TokenAttribute {
            trait_type: "artist".to_string(),
            value: certificate.username.clone(),
        },
        TokenAttribute {
            trait_type: "description".to_string(),
            value: certificate.description.clone(),
        },
        // Verification info
        TokenAttribute {
            trait_type: "verification_hash".to_string(),
            value: certificate.verification_hash.clone(),
        },
        TokenAttribute {
            trait_type: "verification_score".to_string(),
            value: certificate.verification_score.to_string(),
        },
        TokenAttribute {
            trait_type: "authenticity_rating".to_string(),
            value: certificate.authenticity_rating.to_string(),
        },
        TokenAttribute {
            trait_type: "provenance_score".to_string(),
            value: certificate.provenance_score.to_string(),
        },
        TokenAttribute {
            trait_type: "community_trust".to_string(),
            value: certificate.community_trust.to_string(),
        },
        // Creation metadata
        TokenAttribute {
            trait_type: "creation_duration".to_string(),
            value: certificate.metadata.creation_duration.clone(),
        },
        TokenAttribute {
            trait_type: "total_actions".to_string(),
            value: certificate.metadata.total_actions.to_string(),
        },
        TokenAttribute {
            trait_type: "file_format".to_string(),
            value: certificate.metadata.file_format.clone(),
        },
        TokenAttribute {
            trait_type: "creation_tools".to_string(),
            value: certificate.metadata.creation_tools.join(", "),
        },
        // Blockchain info
        TokenAttribute {
            trait_type: "blockchain".to_string(),
            value: certificate.blockchain.clone(),
        },
        TokenAttribute {
            trait_type: "token_standard".to_string(),
            value: certificate.token_standard.clone(),
        },
        TokenAttribute {
            trait_type: "issuer".to_string(),
            value: certificate.issuer.clone(),
        },
        TokenAttribute {
            trait_type: "issue_date".to_string(),
            value: certificate.issue_date.to_string(),
        },
        // Progress photos info
        TokenAttribute {
            trait_type: "photo_count".to_string(),
            value: session.uploaded_photos.len().to_string(),
        },
        TokenAttribute {
            trait_type: "session_id".to_string(),
            value: certificate.session_id.clone(),
        },
        TokenAttribute {
            trait_type: "token_hash".to_string(),
            value: token_hash.clone(),
        },
    ];

    // 9. Add progress photos as attributes
    for (i, photo_url) in session.uploaded_photos.iter().enumerate() {
        attributes.push(TokenAttribute {
            trait_type: format!("progress_photo_{}", i + 1),
            value: photo_url.clone(),
        });
    }

    // 10. Set main image as last progress photo (final progress)
    let main_image = session.uploaded_photos.last().cloned();

    // 11. Create NFT metadata
    let metadata = TokenMetadata {
        name: format!("{} - Certificate NFT #{}", certificate.art_title, token_id),
        description: Some(format!(
            "Digital certificate NFT for artwork: {}. This NFT represents the authenticated certificate with verification score {} and authenticity rating {}.",
            certificate.art_title,
            certificate.verification_score,
            certificate.authenticity_rating
        )),
        image: main_image, // Main image = progress photo terakhir
        attributes,
    };

    // 12. Create token
    let token = Token {
        id: token_id,
        owner: recipient,
        metadata,
        created_at: current_time,
        session_id: Some(certificate.session_id.clone()),
    };

    // 13. Store token
    TOKENS.with(|tokens| {
        tokens.borrow_mut().insert(token_id, token);
    });

    // 14. Update collection total supply
    COLLECTION_METADATA.with(|metadata| {
        let mut collection = metadata.borrow_mut();
        collection.total_supply += 1;
    });

    // 15. Update certificate with NFT info
    let token_uri = format!("https://originstamp.ic0.app/nft/{token_id}/metadata");
    let update_result = crate::modules::certificates::update_certificate_nft_info(
        certificate_id,
        token_id.to_string(),
        token_uri,
    );

    match update_result {
        Ok(_) => Ok(token_id),
        Err(e) => {
            // Rollback token creation if certificate update fails
            TOKENS.with(|tokens| {
                tokens.borrow_mut().remove(&token_id);
            });
            COLLECTION_METADATA.with(|metadata| {
                let mut collection = metadata.borrow_mut();
                collection.total_supply = collection.total_supply.saturating_sub(1);
            });
            Err(format!("Failed to update certificate: {e}"))
        }
    }
}

// Get certificate NFT metadata
#[ic_cdk::query]
pub fn get_certificate_nft_metadata(certificate_id: String) -> Option<String> {
    // 1. Get certificate data
    let certificate =
        crate::modules::certificates::get_certificate_for_nft_minting(certificate_id.clone());
    let certificate = certificate?;

    // 2. Check if NFT exists
    if !certificate.nft_generated || certificate.nft_id.is_none() {
        return None;
    }

    // 3. Get NFT token ID
    let nft_id = certificate.nft_id.unwrap();
    let token_id = nft_id.parse::<u64>().ok()?;

    // 4. Get token details
    let token = get_token_details(token_id)?;

    // 5. Return metadata as JSON string
    Some(serde_json::to_string(&token.metadata).unwrap_or_default())
}

fn generate_token_hash(token_id: u64, session_id: &str, timestamp: u64) -> String {
    let mut hasher = Sha256::new();
    hasher.update(token_id.to_be_bytes());
    hasher.update(session_id.as_bytes());
    hasher.update(timestamp.to_be_bytes());
    format!("{:x}", hasher.finalize())
}
