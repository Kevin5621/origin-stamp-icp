/**
 * Subscription services exports
 */

export * from "./management";

// Export types
export interface SubscriptionTier {
  name: "Free" | "Basic" | "Premium" | "Enterprise";
  price: number;
  currency: string;
  features: string[];
  limits: {
    maxPhotos: number;
    maxFileSizeMB: number;
    canGenerateNFT: boolean;
    prioritySupport: boolean;
  };
}

export interface SubscriptionLimits {
  max_photos: number;
  max_file_size_mb: number;
  can_generate_nft: boolean;
  priority_support: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: "Free" | "Basic" | "Premium" | "Enterprise";
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
  limits: SubscriptionLimits;
  recommended?: boolean;
  popular?: boolean;
  description?: string;
}

export interface CouponData {
  code: string;
  coupon_type: string;
  is_active: boolean;
  max_uses: number;
  current_uses: number;
  expires_at: bigint;
}

// Create subscription service alias for backward compatibility
export { subscriptionManagementService as subscriptionService } from "./management";
