import { backend } from "../../../declarations/backend";
import { idlFactory } from "../../../declarations/backend/backend.did.js";
import type { LoginResult } from "../../../declarations/backend/backend.did";
import { Actor } from "@dfinity/agent";
import { envService } from "./envService";
import { icpAgentService } from "./icpAgentService";

// Type for backend actor with common methods
interface BackendActor {
  register_user: (username: string, password: string) => Promise<LoginResult>;
  login: (username: string, password: string) => Promise<LoginResult>;
  get_certificate_count: () => Promise<bigint>;
  get_user_count: () => Promise<bigint>;
  get_user_avatar: (username: string) => Promise<[] | [string]>;
  get_session_count: () => Promise<bigint>;
  get_s3_config: () => Promise<
    [] | [import("../../../declarations/backend/backend.did").S3Config]
  >;
  get_s3_config_status: () => Promise<boolean>;
  update_user_avatar: (
    username: string,
    avatar_url: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result>;
  create_physical_art_session: (
    username: string,
    art_title: string,
    description: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_1>;
  upload_photo_to_session: (
    session_id: string,
    photo_url: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_1>;
  get_session_details: (
    session_id: string,
  ) => Promise<
    | []
    | [import("../../../declarations/backend/backend.did").PhysicalArtSession]
  >;
  get_user_sessions: (
    username: string,
  ) => Promise<
    import("../../../declarations/backend/backend.did").PhysicalArtSession[]
  >;
  update_session_status: (
    session_id: string,
    status: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_1>;
  remove_photo_from_session: (
    session_id: string,
    photo_url: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_1>;
  // Subscription methods
  get_user_subscription: (
    username: string,
  ) => Promise<
    [] | [import("../../../declarations/backend/backend.did").CouponType]
  >;
  get_subscription_limits: (
    username: string,
  ) => Promise<
    | []
    | [import("../../../declarations/backend/backend.did").SubscriptionLimits]
  >;
  set_user_subscription: (
    username: string,
    subscription_tier: import("../../../declarations/backend/backend.did").CouponType,
  ) => Promise<import("../../../declarations/backend/backend.did").Result>;
  update_user_subscription: (
    username: string,
    subscription_tier: import("../../../declarations/backend/backend.did").CouponType,
  ) => Promise<import("../../../declarations/backend/backend.did").Result>;
  redeem_coupon: (
    username: string,
    coupon_code: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result>;
  initialize_user_subscription: (
    username: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result>;
  get_available_coupons: () => Promise<
    import("../../../declarations/backend/backend.did").Coupon[]
  >;
  initialize_demo_coupons: () => Promise<
    import("../../../declarations/backend/backend.did").Result
  >;
  // NFT methods
  mint_certificate_nft: (
    certificate_id: string,
    recipient: import("../../../declarations/backend/backend.did").Account,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_5>;
  mint_nft_from_session: (
    session_id: string,
    recipient: import("../../../declarations/backend/backend.did").Account,
    metadata: Array<[string, string]>,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_5>;
  generate_certificate: (
    request: import("../../../declarations/backend/backend.did").CreateCertificateRequest,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_2>;
  get_token_details: (
    token_id: bigint,
  ) => Promise<
    [] | [import("../../../declarations/backend/backend.did").Token]
  >;
  get_user_nfts: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    principal: any,
  ) => Promise<import("../../../declarations/backend/backend.did").Token[]>;
  // Dashboard methods
  get_user_dashboard_metrics: (
    username: string,
  ) => Promise<
    | []
    | [import("../../../declarations/backend/backend.did").UserDashboardMetrics]
  >;
  get_user_chart_data: (
    username: string,
    period: string,
  ) => Promise<
    [] | [import("../../../declarations/backend/backend.did").UserChartData]
  >;
  get_user_activity_timeline: (
    username: string,
    limit: bigint,
  ) => Promise<
    import("../../../declarations/backend/backend.did").UserActivity[]
  >;
  get_user_performance_stats: (
    username: string,
  ) => Promise<
    | []
    | [import("../../../declarations/backend/backend.did").UserPerformanceStats]
  >;
  get_user_dashboard_data: (
    username: string,
  ) => Promise<
    [] | [import("../../../declarations/backend/backend.did").UserDashboardData]
  >;
  // Additional methods needed by dashboard service
  get_dashboard_metrics: () => Promise<
    import("../../../declarations/backend/backend.did").DashboardMetrics
  >;
  get_recent_sessions: (
    limit: bigint,
  ) => Promise<
    import("../../../declarations/backend/backend.did").PhysicalArtSession[]
  >;
  get_user_certificates: (
    username: string,
  ) => Promise<
    import("../../../declarations/backend/backend.did").Certificate[]
  >;
}

// Initialize ICP agent for proper connection (only on client-side)
if (typeof window !== "undefined") {
  icpAgentService.initialize().catch((error) => {
    console.error("❌ ICP Agent initialization failed:", error);
  });
}

// Types for marketplace components
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

/**
 * Get a properly configured backend actor using the ICP agent service
 */
export async function getBackendActor(): Promise<BackendActor | null> {
  try {
    // Always use ICP agent service to create actor with proper environment
    const canisterId = envService.getBackendCanisterId();
    if (!canisterId) {
      throw new Error("Backend canister ID not found in environment");
    }

    const agent = await icpAgentService.getAgent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const backendActor = Actor.createActor(idlFactory as any, {
      agent,
      canisterId,
    });

    return backendActor as unknown as BackendActor;
  } catch (error) {
    console.error("❌ Failed to create backend actor:", error);

    // Only fallback to imported backend if it exists
    if (backend) {
      return backend as BackendActor;
    }

    return null;
  }
}

/**
 * Service for handling all backend canister API calls
 */
export const backendService = {
  /**
   * Registers a new user
   * @param username Username for the new user
   * @param password Password for the new user
   * @returns Promise with the registration result
   */
  async registerUser(username: string, password: string): Promise<LoginResult> {
    // Ensure ICP agent is initialized before making calls
    await icpAgentService.initialize();

    // Get a properly configured backend actor
    const backendActor = await getBackendActor();

    if (!backendActor) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }

    try {
      const result = await backendActor.register_user(username, password);
      return result;
    } catch (error) {
      console.error("💥 Error calling backend.register_user:", error);
      throw error;
    }
  },

  /**
   * Logs in a user
   * @param username User's username
   * @param password User's password
   * @returns Promise with the login result
   */
  async login(username: string, password: string): Promise<LoginResult> {
    // Ensure ICP agent is initialized before making calls
    await icpAgentService.initialize();

    // Get a properly configured backend actor
    const backendActor = await getBackendActor();

    if (!backendActor) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }

    try {
      const result = await backendActor.login(username, password);
      return result;
    } catch (error) {
      console.error("💥 Error calling backend.login:", error);
      throw error;
    }
  },

  /**
   * Gets all registered usernames
   * @returns Promise with array of usernames
   */
  async getAllUsers(): Promise<string[]> {
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    return await backend.get_all_users();
  },

  /**
   * Gets user information by username
   * @param username Username to lookup
   * @returns Promise with user info (username, created_at) or undefined if not found
   */
  async getUserInfo(username: string): Promise<[string, bigint] | undefined> {
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    const result = await backend.get_user_info(username);
    return result.length > 0 ? result[0] : undefined;
  },

  /**
   * Gets total number of registered users
   * @returns Promise with user count
   */
  async getUserCount(): Promise<bigint> {
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    return await backend.get_user_count();
  },

  /**
   * Gets user avatar URL
   * @param username Username to lookup
   * @returns Promise with avatar URL or null
   */
  async getUserAvatar(username: string): Promise<string | null> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_avatar(username);
      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error("Failed to get user avatar:", error);
      return null;
    }
  },

  /**
   * Updates user avatar URL
   * @param username Username
   * @param avatarUrl New avatar URL
   * @returns Promise with boolean success
   */
  async updateUserAvatar(
    username: string,
    avatarUrl: string,
  ): Promise<boolean> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.update_user_avatar(username, avatarUrl);
      return "Ok" in result ? Boolean(result.Ok) : false;
    } catch (error) {
      console.error("Failed to update user avatar:", error);
      return false;
    }
  },

  /**
   * Updates user username
   * @param oldUsername Current username
   * @param newUsername New username
   * @param password User's password for verification
   * @returns Promise with the update result
   */
  async updateUsername(
    oldUsername: string,
    newUsername: string,
    password: string,
  ): Promise<LoginResult> {
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    return await backend.update_username(oldUsername, newUsername, password);
  },

  /**
   * Checks if backend is available
   * @returns boolean indicating if backend is initialized
   */
  isAvailable(): boolean {
    // Check if we can get the backend canister ID from environment
    const canisterId = envService.getBackendCanisterId();
    return !!canisterId;
  },

  /**
   * Gets backend canister ID
   * @returns canister ID string or undefined
   */
  getCanisterId(): string | undefined {
    return envService.getBackendCanisterId();
  },

  /**
   * Gets marketplace statistics
   * @returns Promise with marketplace stats
   */
  async getMarketplaceStats(): Promise<NFTMarketplaceStats> {
    try {
      // Ensure ICP agent is initialized before making calls
      await icpAgentService.initialize();

      // Get a properly configured backend actor
      const backendActor = await getBackendActor();

      if (!backendActor) {
        return {
          totalArtworks: "0+",
          totalCreators: "0+",
          totalSessions: "0+",
        };
      }

      const [certificateCount, userCount, sessionCount] = await Promise.all([
        backendActor.get_certificate_count(),
        backendActor.get_user_count(),
        backendActor.get_session_count(),
      ]);

      return {
        totalArtworks: `${certificateCount}+`,
        totalCreators: `${userCount}+`,
        totalSessions: `${sessionCount}+`,
      };
    } catch (error) {
      console.error("Failed to fetch marketplace stats:", error);
      return {
        totalArtworks: "0+",
        totalCreators: "0+",
        totalSessions: "0+",
      };
    }
  },

  /**
   * Gets top creators
   * @returns Promise with creator stats array
   */
  async getTopCreators(): Promise<CreatorStats[]> {
    try {
      if (!backend) {
        return [];
      }

      // Mock data for now until we have more backend methods
      const mockCreators: CreatorStats[] = [
        {
          username: "Kerafuru",
          certificateCount: 47,
          sessionCount: 23,
          hasSubscription: true,
          subscriptionType: "Premium",
        },
        {
          username: "Darmau",
          certificateCount: 32,
          sessionCount: 18,
          hasSubscription: true,
          subscriptionType: "Basic",
        },
        {
          username: "Arziki",
          certificateCount: 28,
          sessionCount: 15,
          hasSubscription: false,
        },
      ];

      return mockCreators.slice(0, 8);
    } catch (error) {
      console.error("Failed to fetch top creators:", error);
      return [];
    }
  },

  /**
   * Gets S3 configuration from backend
   * @returns Promise with S3 config or null
   */
  async getS3Config(): Promise<
    import("../../../declarations/backend/backend.did").S3Config | null
  > {
    try {
      // Ensure ICP agent is initialized before making calls
      await icpAgentService.initialize();

      // Get a properly configured backend actor
      const backendActor = await getBackendActor();

      if (!backendActor) {
        console.warn("Backend actor not available for S3 config");
        return null;
      }

      const s3ConfigOpt = await backendActor.get_s3_config();

      if (s3ConfigOpt && s3ConfigOpt.length > 0) {
        const config = s3ConfigOpt[0];
        if (config) {
          console.log("✅ S3 config retrieved from backend via backendService");
          return config;
        }
      }

      console.warn("⚠️ S3 config not found in backend");
      return null;
    } catch (error) {
      console.error("❌ Failed to get S3 config from backend:", error);
      return null;
    }
  },

  /**
   * Checks if S3 is configured in backend
   * @returns Promise with boolean status
   */
  async isS3Configured(): Promise<boolean> {
    try {
      // Ensure ICP agent is initialized before making calls
      await icpAgentService.initialize();

      // Get a properly configured backend actor
      const backendActor = await getBackendActor();

      if (!backendActor) {
        console.warn("Backend actor not available for S3 status check");
        return false;
      }

      const isConfigured = await backendActor.get_s3_config_status();
      console.log("S3 configuration status from backend:", isConfigured);
      return isConfigured;
    } catch (error) {
      console.error("❌ Failed to check S3 configuration status:", error);
      return false;
    }
  },

  /**
   * Get a properly configured backend actor
   * @returns Promise with backend actor or null
   */
  async getBackendActor(): Promise<BackendActor | null> {
    return await getBackendActor();
  },

  /**
   * Create a new physical art session
   * @param username Username of the user creating the session
   * @param artTitle Title of the art piece
   * @param description Description of the art piece
   * @returns Promise with session ID
   */
  async createPhysicalArtSession(
    username: string,
    artTitle: string,
    description: string,
  ): Promise<string> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.create_physical_art_session(
        username,
        artTitle,
        description,
      );

      if ("Ok" in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to create physical art session:", error);
      throw error;
    }
  },

  /**
   * Upload photo to session
   * @param sessionId Session ID
   * @param photoUrl Photo URL
   * @returns Promise with boolean success
   */
  async uploadPhotoToSession(
    sessionId: string,
    photoUrl: string,
  ): Promise<boolean> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.upload_photo_to_session(
        sessionId,
        photoUrl,
      );

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to upload photo to session:", error);
      throw error;
    }
  },

  /**
   * Get session details
   * @param sessionId Session ID
   * @returns Promise with session details or null
   */
  async getSessionDetails(
    sessionId: string,
  ): Promise<
    | import("../../../declarations/backend/backend.did").PhysicalArtSession
    | null
  > {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_session_details(sessionId);
      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error("Failed to get session details:", error);
      throw error;
    }
  },

  /**
   * Get user sessions
   * @param username Username
   * @returns Promise with array of sessions
   */
  async getUserSessions(
    username: string,
  ): Promise<
    import("../../../declarations/backend/backend.did").PhysicalArtSession[]
  > {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      return await backendActor.get_user_sessions(username);
    } catch (error) {
      console.error("Failed to get user sessions:", error);
      throw error;
    }
  },

  /**
   * Update session status
   * @param sessionId Session ID
   * @param status New status
   * @returns Promise with boolean success
   */
  async updateSessionStatus(
    sessionId: string,
    status: string,
  ): Promise<boolean> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.update_session_status(
        sessionId,
        status,
      );

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to update session status:", error);
      throw error;
    }
  },

  /**
   * Remove photo from session
   * @param sessionId Session ID
   * @param photoUrl Photo URL to remove
   * @returns Promise with boolean success
   */
  async removePhotoFromSession(
    sessionId: string,
    photoUrl: string,
  ): Promise<boolean> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.remove_photo_from_session(
        sessionId,
        photoUrl,
      );

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to remove photo from session:", error);
      throw error;
    }
  },

  // ===== SUBSCRIPTION METHODS =====

  /**
   * Get user subscription tier
   * @param username Username
   * @returns Promise with subscription tier or null
   */
  async getUserSubscription(username: string): Promise<string | null> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_subscription(username);

      if (result.length > 0) {
        const subscriptionType = result[0]!;
        // Convert CouponType variant to string
        if ("Free" in subscriptionType) return "Free";
        if ("Basic" in subscriptionType) return "Basic";
        if ("Premium" in subscriptionType) return "Premium";
        if ("Enterprise" in subscriptionType) return "Enterprise";
      }

      return null;
    } catch (error) {
      console.error("Failed to get user subscription:", error);
      throw error;
    }
  },

  /**
   * Get user subscription limits
   * @param username Username
   * @returns Promise with subscription limits or null
   */
  async getUserSubscriptionLimits(username: string): Promise<{
    max_photos: number;
    max_file_size_mb: number;
    can_generate_nft: boolean;
    priority_support: boolean;
  } | null> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_subscription_limits(username);

      if (result.length > 0) {
        const limits = result[0]!;
        return {
          max_photos: Number(limits.max_photos),
          max_file_size_mb: Number(limits.max_file_size_mb),
          can_generate_nft: limits.can_generate_nft,
          priority_support: limits.priority_support,
        };
      }

      return null;
    } catch (error) {
      console.error("Failed to get subscription limits:", error);
      throw error;
    }
  },

  /**
   * Update user subscription tier
   * @param username Username
   * @param subscriptionTier Subscription tier
   * @returns Promise with boolean success
   */
  async updateUserSubscription(
    username: string,
    subscriptionTier: "Free" | "Basic" | "Premium" | "Enterprise",
  ): Promise<boolean> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Convert string to CouponType variant
      let couponType: import("../../../declarations/backend/backend.did").CouponType;
      switch (subscriptionTier) {
        case "Free":
          couponType = { Free: null };
          break;
        case "Basic":
          couponType = { Basic: null };
          break;
        case "Premium":
          couponType = { Premium: null };
          break;
        case "Enterprise":
          couponType = { Enterprise: null };
          break;
        default:
          throw new Error(`Invalid subscription tier: ${subscriptionTier}`);
      }

      const result = await backendActor.update_user_subscription(
        username,
        couponType,
      );

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to update user subscription:", error);
      throw error;
    }
  },

  /**
   * Redeem coupon code
   * @param username Username
   * @param couponCode Coupon code
   * @returns Promise with boolean success
   */
  async redeemCoupon(username: string, couponCode: string): Promise<boolean> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.redeem_coupon(username, couponCode);

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to redeem coupon:", error);
      throw error;
    }
  },

  /**
   * Initialize user subscription (set to Free tier)
   * @param username Username
   * @returns Promise with boolean success
   */
  async initializeUserSubscription(username: string): Promise<boolean> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.initialize_user_subscription(username);

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to initialize user subscription:", error);
      throw error;
    }
  },

  /**
   * Get available coupons
   * @returns Promise with array of coupons
   */
  async getAvailableCoupons(): Promise<
    Array<{
      code: string;
      coupon_type: string;
      is_active: boolean;
      max_uses: number;
      current_uses: number;
      expires_at: bigint;
    }>
  > {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const coupons = await backendActor.get_available_coupons();

      return coupons.map((coupon) => ({
        code: coupon.code,
        coupon_type:
          "Free" in coupon.coupon_type
            ? "Free"
            : "Basic" in coupon.coupon_type
              ? "Basic"
              : "Premium" in coupon.coupon_type
                ? "Premium"
                : "Enterprise" in coupon.coupon_type
                  ? "Enterprise"
                  : "Free",
        is_active: coupon.is_active,
        max_uses: Number(coupon.max_uses),
        current_uses: Number(coupon.current_uses),
        expires_at: coupon.expires_at,
      }));
    } catch (error) {
      console.error("Failed to get available coupons:", error);
      throw error;
    }
  },

  /**
   * Initialize demo coupons
   * @returns Promise with boolean success
   */
  async initializeDemoCoupons(): Promise<boolean> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.initialize_demo_coupons();

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to initialize demo coupons:", error);
      throw error;
    }
  },

  // ===== NFT METHODS =====

  /**
   * Generate certificate for session
   * @param request Certificate creation request
   * @returns Promise with certificate data or null
   */
  async generateCertificate(request: {
    session_id: string;
    username: string;
    art_title: string;
    description: string;
    photo_count: number;
    creation_duration: number;
    file_format: string;
    creation_tools: string[];
    file_sizes: bigint[];
  }): Promise<{
    certificate_id: string;
    session_id: string;
    username: string;
    art_title: string;
    description: string;
    issue_date: bigint;
    expiry_date: bigint;
    verification_hash: string;
    blockchain_tx: string;
    qr_code_data: string;
    verification_url: string;
    certificate_type: string;
    verification_score: number;
    authenticity_rating: number;
    provenance_score: number;
    community_trust: number;
    certificate_status: string;
    issuer: string;
    blockchain: string;
    token_standard: string;
    metadata: {
      creation_duration: string;
      total_actions: number;
      file_size: string;
      file_format: string;
      creation_tools: string[];
    };
    nft_generated: boolean;
    nft_id?: string;
    token_uri?: string;
  } | null> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.generate_certificate(request);

      if ("Ok" in result) {
        const cert = result.Ok;
        return {
          certificate_id: cert.certificate_id,
          session_id: cert.session_id,
          username: cert.username,
          art_title: cert.art_title,
          description: cert.description,
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
          verification_hash: cert.verification_hash,
          blockchain_tx: cert.blockchain_tx,
          qr_code_data: cert.qr_code_data,
          verification_url: cert.verification_url,
          certificate_type: cert.certificate_type,
          verification_score: Number(cert.verification_score),
          authenticity_rating: Number(cert.authenticity_rating),
          provenance_score: Number(cert.provenance_score),
          community_trust: Number(cert.community_trust),
          certificate_status: cert.certificate_status,
          issuer: cert.issuer,
          blockchain: cert.blockchain,
          token_standard: cert.token_standard,
          metadata: {
            creation_duration: cert.metadata.creation_duration,
            total_actions: Number(cert.metadata.total_actions),
            file_size: cert.metadata.file_size,
            file_format: cert.metadata.file_format,
            creation_tools: cert.metadata.creation_tools,
          },
          nft_generated: cert.nft_generated,
          nft_id: cert.nft_id?.[0],
          token_uri: cert.token_uri?.[0],
        };
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to generate certificate:", error);
      throw error;
    }
  },

  /**
   * Mint NFT from certificate
   * @param certificateId Certificate ID
   * @param userPrincipal User principal for NFT ownership
   * @returns Promise with NFT token ID
   */
  async mintCertificateNFT(
    certificateId: string,
    userPrincipal: string,
  ): Promise<string> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Convert string principal to Principal object
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(userPrincipal);

      const recipient = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: principal as any,
        subaccount: [] as [] | [number[]],
      };

      const result = await backendActor.mint_certificate_nft(
        certificateId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recipient as any,
      );

      if ("Ok" in result) {
        return result.Ok.toString();
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to mint certificate NFT:", error);
      throw error;
    }
  },

  /**
   * Mint NFT directly from session
   * @param sessionId Session ID
   * @param userPrincipal User principal for NFT ownership
   * @param metadata Additional metadata for NFT
   * @returns Promise with NFT token ID
   */
  async mintNFTFromSession(
    sessionId: string,
    userPrincipal: string,
    metadata: Array<[string, string]> = [],
  ): Promise<string> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Convert string principal to Principal object
      const { Principal } = await import("@dfinity/principal");
      let principal;

      try {
        principal = Principal.fromText(userPrincipal);
      } catch {
        console.warn(
          `Invalid principal format: ${userPrincipal}, generating new one...`,
        );
        // Generate a valid principal from the invalid one
        const encoder = new TextEncoder();
        const data = encoder.encode(userPrincipal + "originstamp_SALT_2025");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // Take first 8 bytes and create valid Principal
        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
          bytes[i] = hashArray[i] || 0;
        }

        principal = Principal.fromUint8Array(bytes);
        console.log(`Generated new valid principal: ${principal.toText()}`);
      }

      const recipient = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: principal as any,
        subaccount: [] as [] | [number[]],
      };

      const result = await backendActor.mint_nft_from_session(
        sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recipient as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata as any,
      );

      if ("Ok" in result) {
        return result.Ok.toString();
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to mint NFT from session:", error);
      throw error;
    }
  },

  /**
   * Get token details by ID
   * @param tokenId Token ID
   * @returns Promise with token data or null
   */
  async getTokenDetails(tokenId: bigint): Promise<{
    id: bigint;
    owner: {
      owner: string;
      subaccount: [] | [number[]];
    };
    metadata: {
      name: string;
      description: [] | [string];
      attributes: Array<{ trait_type: string; value: string }>;
      image: [] | [string];
    };
    session_id: [] | [string];
    created_at: bigint;
  } | null> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_token_details(tokenId);

      if (result.length > 0) {
        const token = result[0]!;
        return {
          id: token.id,
          owner: {
            owner: token.owner.owner.toString(),
            subaccount: token.owner.subaccount as [] | [number[]],
          },
          metadata: {
            name: token.metadata.name,
            description: token.metadata.description,
            attributes: token.metadata.attributes,
            image: token.metadata.image,
          },
          session_id: token.session_id,
          created_at: token.created_at,
        };
      }

      return null;
    } catch (error) {
      console.error("Failed to get token details:", error);
      throw error;
    }
  },

  /**
   * Get user's NFTs
   * @param userPrincipal User principal
   * @returns Promise with array of user's NFTs
   */
  async getUserNFTs(
    userPrincipal: string,
  ): Promise<import("../../../declarations/backend/backend.did").Token[]> {
    try {
      await icpAgentService.initialize();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Convert string principal to Principal object
      const { Principal } = await import("@dfinity/principal");
      let principal;

      try {
        principal = Principal.fromText(userPrincipal);
      } catch {
        console.warn(
          `Invalid principal format: ${userPrincipal}, generating new one...`,
        );
        // Generate a valid principal from the invalid one
        const encoder = new TextEncoder();
        const data = encoder.encode(userPrincipal + "originstamp_SALT_2025");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // Take first 8 bytes and create valid Principal
        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
          bytes[i] = hashArray[i] || 0;
        }

        principal = Principal.fromUint8Array(bytes);
        console.log(`Generated new valid principal: ${principal.toText()}`);
      }

      const result = await backendActor.get_user_nfts(principal);
      return result;
    } catch (error) {
      console.error("Failed to get user NFTs:", error);
      throw error;
    }
  },
};
