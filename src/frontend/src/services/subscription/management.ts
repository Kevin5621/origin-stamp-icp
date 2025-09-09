/**
 * Subscription Service Module
 * Handles user subscription operations
 */

import { getBackendActor, initializeBackend } from "../core/backend";

/**
 * Subscription Service
 */
export const subscriptionManagementService = {
  /**
   * Get user subscription tier
   * @param username Username
   * @returns Promise with subscription tier or null
   */
  async getUserSubscription(username: string): Promise<string | null> {
    try {
      await initializeBackend();
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
      await initializeBackend();
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
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Convert string to CouponType variant
      let couponType: import("../../../../declarations/backend/backend.did").CouponType;
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
      await initializeBackend();
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
      await initializeBackend();
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
      await initializeBackend();
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
      await initializeBackend();
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
};
