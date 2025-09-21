/**
 * Core types and interfaces for the backend service modules
 * Shared across all service modules
 */

import type { LoginResult } from "../../../../declarations/backend/backend.did";

// Core backend actor interface with all methods
export interface BackendActor {
  register_user: (username: string, password: string) => Promise<LoginResult>;
  login: (username: string, password: string) => Promise<LoginResult>;
  authenticate_with_principal: (principal: string) => Promise<LoginResult>;
  get_certificate_count: () => Promise<bigint>;
  get_user_count: () => Promise<bigint>;
  get_user_avatar: (username: string) => Promise<[] | [string]>;
  get_session_count: () => Promise<bigint>;
  get_s3_config: () => Promise<
    [] | [import("../../../../declarations/backend/backend.did").S3Config]
  >;
  get_s3_config_status: () => Promise<boolean>;
  update_user_avatar: (
    username: string,
    avatar_url: string,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result>;
  create_physical_art_session: (
    username: string,
    art_title: string,
    description: string,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_1>;
  upload_photo_to_session: (
    session_id: string,
    photo_url: string,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_1>;
  get_session_details: (
    session_id: string,
  ) => Promise<
    | []
    | [
        import("../../../../declarations/backend/backend.did").PhysicalArtSession,
      ]
  >;
  get_user_sessions: (
    username: string,
  ) => Promise<
    import("../../../../declarations/backend/backend.did").PhysicalArtSession[]
  >;
  update_session_status: (
    session_id: string,
    status: string,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_1>;
  remove_photo_from_session: (
    session_id: string,
    photo_url: string,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_1>;
  // Verification methods
  create_verification_request: (
    session_id: string,
    asset_urls: string[],
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_1>;
  get_verification_result: (
    verification_id: string,
  ) => Promise<
    | []
    | [
        import("../../../../declarations/backend/backend.did").AIVerificationResult,
      ]
  >;
  get_session_verifications: (
    session_id: string,
  ) => Promise<
    import("../../../../declarations/backend/backend.did").AIVerificationResult[]
  >;
  update_verification_result: (
    verification_id: string,
    result: import("../../../../declarations/backend/backend.did").AIVerificationResult,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_2>;
  get_pending_verifications: () => Promise<
    import("../../../../declarations/backend/backend.did").AIVerificationResult[]
  >;
  manual_verification_override: (
    verification_id: string,
    status: string,
    admin_notes: string,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_2>;
  // Subscription methods
  get_user_subscription: (
    username: string,
  ) => Promise<
    [] | [import("../../../../declarations/backend/backend.did").CouponType]
  >;
  get_subscription_limits: (
    username: string,
  ) => Promise<
    | []
    | [
        import("../../../../declarations/backend/backend.did").SubscriptionLimits,
      ]
  >;
  set_user_subscription: (
    username: string,
    subscription_tier: import("../../../../declarations/backend/backend.did").CouponType,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result>;
  update_user_subscription: (
    username: string,
    subscription_tier: import("../../../../declarations/backend/backend.did").CouponType,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result>;
  redeem_coupon: (
    username: string,
    coupon_code: string,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result>;
  initialize_user_subscription: (
    username: string,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result>;
  get_available_coupons: () => Promise<
    import("../../../../declarations/backend/backend.did").Coupon[]
  >;
  initialize_demo_coupons: () => Promise<
    import("../../../../declarations/backend/backend.did").Result
  >;
  // NFT methods
  mint_certificate_nft: (
    certificate_id: string,
    recipient: import("../../../../declarations/backend/backend.did").Account,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_5>;
  mint_nft_from_session: (
    session_id: string,
    recipient: import("../../../../declarations/backend/backend.did").Account,
    metadata: Array<[string, string]>,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_5>;
  generate_certificate: (
    request: import("../../../../declarations/backend/backend.did").CreateCertificateRequest,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_2>;
  get_token_details: (
    token_id: bigint,
  ) => Promise<
    [] | [import("../../../../declarations/backend/backend.did").Token]
  >;
  get_user_nfts: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    principal: any,
  ) => Promise<import("../../../../declarations/backend/backend.did").Token[]>;
  // NFT Listing methods
  list_nft: (
    token_id: bigint,
    price: string,
    currency: import("../../../../declarations/backend/backend.did").Currency,
  ) => Promise<
    import("../../../../declarations/backend/backend.did").ListingResult
  >;
  delist_nft: (
    token_id: bigint,
  ) => Promise<
    import("../../../../declarations/backend/backend.did").DelistingResult
  >;
  get_active_listings: () => Promise<
    import("../../../../declarations/backend/backend.did").NFTListing[]
  >;
  get_token_listing: (
    token_id: bigint,
  ) => Promise<
    [] | [import("../../../../declarations/backend/backend.did").NFTListing]
  >;
  // Trading methods
  purchase_nft_with_icp: (
    token_id: bigint,
    buyer: import("../../../../declarations/backend/backend.did").Account,
    price: bigint,
  ) => Promise<import("../../../../declarations/backend/backend.did").Result_7>;
  // Debug functions
  debug_token_ownership: (token_id: bigint) => Promise<string>;
  debug_caller_identity: () => Promise<string>;
  // Dashboard methods
  get_user_dashboard_metrics: (
    username: string,
  ) => Promise<
    | []
    | [
        import("../../../../declarations/backend/backend.did").UserDashboardMetrics,
      ]
  >;
  get_user_chart_data: (
    username: string,
    period: string,
  ) => Promise<
    [] | [import("../../../../declarations/backend/backend.did").UserChartData]
  >;
  get_user_activity_timeline: (
    username: string,
    limit: bigint,
  ) => Promise<
    import("../../../../declarations/backend/backend.did").UserActivity[]
  >;
  get_user_performance_stats: (
    username: string,
  ) => Promise<
    | []
    | [
        import("../../../../declarations/backend/backend.did").UserPerformanceStats,
      ]
  >;
  get_user_dashboard_data: (
    username: string,
  ) => Promise<
    | []
    | [import("../../../../declarations/backend/backend.did").UserDashboardData]
  >;
  // Additional methods needed by dashboard service
  get_dashboard_metrics: () => Promise<
    import("../../../../declarations/backend/backend.did").DashboardMetrics
  >;
  get_recent_sessions: (
    limit: bigint,
  ) => Promise<
    import("../../../../declarations/backend/backend.did").PhysicalArtSession[]
  >;
  get_user_certificates: (
    username: string,
  ) => Promise<
    import("../../../../declarations/backend/backend.did").Certificate[]
  >;

  // Marketplace methods
  get_marketplace_featured_collections: () => Promise<
    import("../../../../declarations/backend/backend.did").MarketplaceFeaturedCollection[]
  >;
  get_trending_creators: (
    limit: bigint,
  ) => Promise<
    import("../../../../declarations/backend/backend.did").TrendingCreator[]
  >;
  get_marketplace_banner: () => Promise<
    | []
    | [import("../../../../declarations/backend/backend.did").MarketplaceBanner]
  >;
}

// Marketplace types
export interface NFTMarketplaceStats {
  totalArtworks: string;
  totalCreators: string;
  totalSessions: string;
}

export interface CreatorStats {
  username: string;
  certificateCount: number;
  sessionCount: number;
  hasSubscription: boolean;
  subscriptionType?: string;
}
