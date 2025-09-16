use candid::{CandidType, Deserialize};

/// Featured collection data for marketplace
#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct MarketplaceFeaturedCollection {
    pub creator_username: String,
    pub creator_avatar: Option<String>,
    pub total_listed_artworks: u64,
    pub floor_price: Option<String>,
    pub price_change_24h: f64,
    pub verified: bool,
    pub sample_artwork_url: Option<String>,
}

/// Trending creator data for marketplace
#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct TrendingCreator {
    pub username: String,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub joined_date: u64,
    pub total_artworks: u64,
    pub verified: bool,
}

/// Marketplace banner content
#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct MarketplaceBanner {
    pub title: String,
    pub description: String,
    pub cta_text: String,
    pub cta_link: String,
    pub background_image: Option<String>,
}
