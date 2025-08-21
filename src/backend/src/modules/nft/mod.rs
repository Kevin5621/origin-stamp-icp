use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::{Account, Token, TokenMetadata, TransferRequest, TransferResponse, CollectionMetadata};
use crate::modules::physical_art;

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
    let session =
        PHYSICAL_ART_SESSIONS.with(|sessions| sessions.borrow().get(&session_id).cloned());

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
        ("session_id".to_string(), session_id.clone()),
        ("artist".to_string(), session.username.clone()),
        ("art_title".to_string(), session.art_title.clone()),
        ("created_at".to_string(), current_time.to_string()),
        ("token_hash".to_string(), token_hash),
        (
            "photo_count".to_string(),
            session.uploaded_photos.len().to_string(),
        ),
    ];

    // Add additional attributes
    attributes.extend(additional_attributes);

    // Add photo URLs as attributes if available
    for (i, photo_url) in session.uploaded_photos.iter().enumerate() {
        attributes.push((format!("photo_{}", i + 1), photo_url.clone()));
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

fn generate_token_hash(token_id: u64, session_id: &str, timestamp: u64) -> String {
    let mut hasher = Sha256::new();
    hasher.update(token_id.to_be_bytes());
    hasher.update(session_id.as_bytes());
    hasher.update(timestamp.to_be_bytes());
    format!("{:x}", hasher.finalize())
}
