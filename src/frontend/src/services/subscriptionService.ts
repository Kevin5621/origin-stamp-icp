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

// Hardcoded demo coupons (not displayed in UI but available for testing)
const DEMO_COUPONS: Coupon[] = [
  {
    code: "DEMO-BASIC-2025",
    coupon_type: "Basic",
    is_active: true,
    max_uses: 100,
    current_uses: 0,
    expires_at: BigInt(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  },
  {
    code: "DEMO-PREMIUM-2025",
    coupon_type: "Premium",
    is_active: true,
    max_uses: 50,
    current_uses: 0,
    expires_at: BigInt(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
  },
  {
    code: "DEMO-ENTERPRISE-2025",
    coupon_type: "Enterprise",
    is_active: true,
    max_uses: 25,
    current_uses: 0,
    expires_at: BigInt(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
  },
];

// Mock user subscriptions storage (for demo purposes)
const USER_SUBSCRIPTIONS: Map<string, SubscriptionTier> = new Map();

// Initialize demo for browser console access
if (typeof window !== "undefined") {
  (window as unknown as { [key: string]: unknown }).demoCoupons = {
    list: () => subscriptionService.logDemoCoupons(),
    codes: DEMO_COUPONS.map((c) => c.code),
  };
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
      // For demo purposes, return mock data
      const subscription = USER_SUBSCRIPTIONS.get(username) || "Free";
      return subscription;
    } catch (error) {
      console.error("Failed to get user subscription:", error);
      return "Free"; // Default to free tier
    }
  },

  /**
   * Get subscription limits for a user
   */
  async getUserSubscriptionLimits(
    username: string,
  ): Promise<SubscriptionLimits | null> {
    try {
      const subscription = await this.getUserSubscription(username);
      if (!subscription) return null;

      const plan = this.getSubscriptionPlan(subscription);
      return plan?.limits || null;
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
      USER_SUBSCRIPTIONS.set(username, "Free");
      return true;
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
      USER_SUBSCRIPTIONS.set(username, tier);
      console.log(`✅ User ${username} subscription updated to ${tier}`);
      return true;
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
      const coupon = DEMO_COUPONS.find(
        (c) =>
          c.code === couponCode && c.is_active && c.current_uses < c.max_uses,
      );

      if (!coupon) {
        console.log("❌ Invalid or expired coupon code");
        return false;
      }

      // Update user subscription to coupon tier
      USER_SUBSCRIPTIONS.set(username, coupon.coupon_type);

      // Increment coupon usage (demo purposes)
      coupon.current_uses++;

      console.log(
        `✅ Coupon ${couponCode} redeemed! User ${username} upgraded to ${coupon.coupon_type}`,
      );
      return true;
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
      return DEMO_COUPONS.filter((c) => c.is_active);
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
      console.log(
        "✅ Demo coupons initialized:",
        DEMO_COUPONS.map((c) => c.code),
      );
      return true;
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
   * Get demo coupons for testing (not displayed in UI)
   */
  getDemoCoupons(): Coupon[] {
    return DEMO_COUPONS;
  },

  /**
   * Log available demo coupons to console (for testing)
   */
  logDemoCoupons(): void {
    console.log("🎟️ Available Demo Coupons:");
    DEMO_COUPONS.forEach((coupon) => {
      console.log(
        `- ${coupon.code}: ${coupon.coupon_type} tier (${coupon.max_uses - coupon.current_uses} uses left)`,
      );
    });
    console.log("💡 Use these codes in the coupon redemption section!");
  },
};
