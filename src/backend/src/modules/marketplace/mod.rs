use crate::modules::nft::{get_active_listings, get_token_details, get_user_nfts};
use crate::modules::users::{get_all_users, get_user_info, get_user_profile};
use crate::types::{MarketplaceBanner, MarketplaceFeaturedCollection, TrendingCreator};
use std::collections::HashMap;

/// Get featured collections for marketplace
/// Returns collections with listed artworks grouped by creator
#[ic_cdk::query]
pub fn get_marketplace_featured_collections() -> Vec<MarketplaceFeaturedCollection> {
    let listings = get_active_listings();
    let mut creator_stats: HashMap<String, MarketplaceFeaturedCollection> = HashMap::new();

    // Group listings by creator and calculate stats
    for listing in listings {
        if let Some(token) = get_token_details(listing.token_id) {
            // Get session details to find creator
            if let Some(session_id) = &token.session_id {
                if let Some(session) =
                    crate::modules::physical_art::get_session_details(session_id.clone())
                {
                    let creator_username = session.username.clone();

                    // Get user profile for avatar
                    let user_profile = get_user_profile(creator_username.clone());
                    let avatar_url = user_profile.and_then(|p| p.avatar_url);

                    // Parse price for floor calculation
                    let price_value = listing
                        .price
                        .replace(" ICP", "")
                        .replace(" USDT", "")
                        .parse::<f64>()
                        .unwrap_or(0.0);

                    // Update or create creator stats
                    creator_stats
                        .entry(creator_username.clone())
                        .and_modify(|stats| {
                            stats.total_listed_artworks += 1;
                            // Update floor price if this is lower
                            if let Some(current_floor) = &stats.floor_price {
                                let current_value = current_floor
                                    .replace(" ICP", "")
                                    .replace(" USDT", "")
                                    .parse::<f64>()
                                    .unwrap_or(f64::MAX);
                                if price_value < current_value {
                                    stats.floor_price = Some(listing.price.clone());
                                }
                            }
                            // Update sample artwork URL if not set
                            if stats.sample_artwork_url.is_none() {
                                stats.sample_artwork_url = token.metadata.image.clone();
                            }
                        })
                        .or_insert(MarketplaceFeaturedCollection {
                            creator_username: creator_username.clone(),
                            creator_avatar: avatar_url,
                            total_listed_artworks: 1,
                            floor_price: Some(listing.price.clone()),
                            price_change_24h: 0.0, // TODO: Calculate actual price change
                            verified: true,        // TODO: Implement verification logic
                            sample_artwork_url: token.metadata.image.clone(),
                        });
                }
            }
        }
    }

    // Convert to vector and sort by total artworks (descending)
    let mut featured_collections: Vec<MarketplaceFeaturedCollection> =
        creator_stats.into_values().collect();
    featured_collections.sort_by(|a, b| b.total_listed_artworks.cmp(&a.total_listed_artworks));

    // Return top 4 for featured display
    featured_collections.into_iter().take(4).collect()
}

/// Get trending creators for marketplace
/// Returns recently joined users with their artwork count
#[ic_cdk::query]
pub fn get_trending_creators(limit: u64) -> Vec<TrendingCreator> {
    let all_users = get_all_users();
    let mut trending_creators = Vec::new();

    for username in all_users {
        if let Some(user_info) = get_user_info(username.clone()) {
            if let Some(user_profile) = get_user_profile(username.clone()) {
                // Get user's NFT count as artwork count
                let principal = ic_cdk::caller(); // This is a placeholder - in real implementation, we'd need user's principal
                let user_nfts = get_user_nfts(principal);
                let artwork_count = user_nfts.len() as u64;

                // Use display_name if available, otherwise fall back to username
                let display_name = user_profile.display_name.or(Some(username.clone()));

                trending_creators.push(TrendingCreator {
                    username: username.clone(),
                    display_name,
                    avatar_url: user_profile.avatar_url,
                    joined_date: user_info.1, // creation timestamp
                    total_artworks: artwork_count,
                    verified: true, // TODO: Implement verification logic
                });
            }
        }
    }

    // Sort by join date (newest first) and then by artwork count
    trending_creators.sort_by(|a, b| {
        b.joined_date
            .cmp(&a.joined_date)
            .then(b.total_artworks.cmp(&a.total_artworks))
    });

    // Return limited results
    trending_creators.into_iter().take(limit as usize).collect()
}

/// Get marketplace banner content
/// Returns static banner content for development phase
#[ic_cdk::query]
pub fn get_marketplace_banner() -> Option<MarketplaceBanner> {
    Some(MarketplaceBanner {
        title: "Discover Authenticated Digital Art".to_string(),
        description: "Explore verified artworks with AI-powered authentication certificates"
            .to_string(),
        cta_text: "Browse Collections".to_string(),
        cta_link: "/marketplace".to_string(),
        background_image: None,
    })
}
