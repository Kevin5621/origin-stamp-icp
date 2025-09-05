import { backendService } from "./backendService";

// Types for subscription management
export type SubscriptionTier = "Free" | "Basic" | "Premium" | "Enterprise";

export interface SubscriptionLimits {
  max_photos: number;
  max_file_size_mb: number;
  can_generate_nft: boolean;
  priority_support: boolean;
}

export interface Coupon {
  code: string;
  coupon_type: "Free" | "Basic" | "Premium" | "Enterprise";
  is_active: boolean;
  max_uses: number;
  current_uses: number;
  expires_at: bigint;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: string;
  description: string;
  features: string[];
  limits: SubscriptionLimits;
  popular?: boolean;
}

/**
 * Service for handling all subscription-related operations
 */
export const subscriptionService = {
  /**
   * Get user's current subscription tier
   */
  async getUserSubscription(
    username: string,
  ): Promise<SubscriptionTier | null> {
    try {
      const subscription = await backendService.getUserSubscription(username);
      return subscription as SubscriptionTier | null;
    } catch (error) {
      console.error("Failed to get user subscription:", error);
      return null;
    }
  },

  /**
   * Get subscription limits for a user
   */
  async getUserSubscriptionLimits(
    username: string,
  ): Promise<SubscriptionLimits | null> {
    try {
      const limits = await backendService.getUserSubscriptionLimits(username);
      return limits;
    } catch (error) {
      console.error("Failed to get subscription limits:", error);
      return null;
    }
  },

  /**
   * Initialize user subscription (set to Free tier)
   */
  async initializeUserSubscription(username: string): Promise<boolean> {
    try {
      return await backendService.initializeUserSubscription(username);
    } catch (error) {
      console.error("Failed to initialize user subscription:", error);
      return false;
    }
  },

  /**
   * Update user subscription tier
   */
  async updateUserSubscription(
    username: string,
    tier: SubscriptionTier,
  ): Promise<boolean> {
    try {
      const success = await backendService.updateUserSubscription(
        username,
        tier,
      );
      if (success) {
        console.log(`✅ User ${username} subscription updated to ${tier}`);
      }
      return success;
    } catch (error) {
      console.error("Failed to update user subscription:", error);
      return false;
    }
  },

  /**
   * Redeem a coupon code
   */
  async redeemCoupon(username: string, couponCode: string): Promise<boolean> {
    try {
      const success = await backendService.redeemCoupon(username, couponCode);
      if (success) {
        console.log(
          `✅ Coupon ${couponCode} redeemed! User ${username} upgraded`,
        );
      } else {
        console.log("❌ Invalid or expired coupon code");
      }
      return success;
    } catch (error) {
      console.error("Failed to redeem coupon:", error);
      return false;
    }
  },

  /**
   * Get available coupons (for admin/debug purposes)
   */
  async getAvailableCoupons(): Promise<Coupon[]> {
    try {
      const coupons = await backendService.getAvailableCoupons();
      return coupons.map((coupon) => ({
        code: coupon.code,
        coupon_type: coupon.coupon_type as SubscriptionTier,
        is_active: coupon.is_active,
        max_uses: coupon.max_uses,
        current_uses: coupon.current_uses,
        expires_at: coupon.expires_at,
      }));
    } catch (error) {
      console.error("Failed to get available coupons:", error);
      return [];
    }
  },

  /**
   * Initialize demo coupons in backend
   */
  async initializeDemoCoupons(): Promise<boolean> {
    try {
      const success = await backendService.initializeDemoCoupons();
      if (success) {
        console.log("✅ Demo coupons initialized in backend");
      }
      return success;
    } catch (error) {
      console.error("Failed to initialize demo coupons:", error);
      return false;
    }
  },

  /**
   * Get all subscription plans with their features and limits
   */
  getSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        tier: "Free",
        name: "Free",
        price: "Free",
        description: "Perfect for getting started with art authentication",
        features: [
          "Up to 5 photos per session",
          "10MB file size limit",
          "Basic support",
          "Community access",
        ],
        limits: {
          max_photos: 5,
          max_file_size_mb: 10,
          can_generate_nft: false,
          priority_support: false,
        },
      },
      {
        tier: "Basic",
        name: "Basic",
        price: "$9.99/month",
        description: "Essential features for serious artists",
        features: [
          "Up to 20 photos per session",
          "25MB file size limit",
          "NFT generation",
          "Email support",
          "Priority processing",
        ],
        limits: {
          max_photos: 20,
          max_file_size_mb: 25,
          can_generate_nft: true,
          priority_support: false,
        },
      },
      {
        tier: "Premium",
        name: "Premium",
        price: "$29.99/month",
        description: "Professional features for established artists",
        popular: true,
        features: [
          "Up to 100 photos per session",
          "50MB file size limit",
          "NFT generation",
          "Priority support",
          "Advanced analytics",
          "Custom branding",
        ],
        limits: {
          max_photos: 100,
          max_file_size_mb: 50,
          can_generate_nft: true,
          priority_support: true,
        },
      },
      {
        tier: "Enterprise",
        name: "Enterprise",
        price: "$99.99/month",
        description: "Unlimited features for galleries and institutions",
        features: [
          "Up to 1000 photos per session",
          "100MB file size limit",
          "NFT generation",
          "Dedicated support",
          "Custom integrations",
          "White-label solutions",
        ],
        limits: {
          max_photos: 1000,
          max_file_size_mb: 100,
          can_generate_nft: true,
          priority_support: true,
        },
      },
    ];
  },

  /**
   * Get subscription plan by tier
   */
  getSubscriptionPlan(tier: SubscriptionTier): SubscriptionPlan | null {
    const plans = this.getSubscriptionPlans();
    return plans.find((plan) => plan.tier === tier) || null;
  },

  /**
   * Log available demo coupons to console (for testing)
   */
  async logDemoCoupons(): Promise<void> {
    try {
      const coupons = await this.getAvailableCoupons();
      console.log("🎟️ Available Demo Coupons:");
      coupons.forEach((coupon) => {
        console.log(
          `- ${coupon.code}: ${coupon.coupon_type} tier (${coupon.max_uses - coupon.current_uses} uses left)`,
        );
      });
      console.log("💡 Use these codes in the coupon redemption section!");
    } catch (error) {
      console.error("Failed to log demo coupons:", error);
    }
  },
};
