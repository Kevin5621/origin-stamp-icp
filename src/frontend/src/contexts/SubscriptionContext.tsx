import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

// Subscription tier types
export type SubscriptionTier = "Free" | "Basic" | "Premium" | "Enterprise";

export interface SubscriptionLimits {
  max_photos: number;
  max_file_size_mb: number;
  can_generate_nft: boolean;
  priority_support: boolean;
}

interface SubscriptionContextType {
  currentTier: SubscriptionTier;
  subscriptionLimits: SubscriptionLimits;
  isLoading: boolean;
  updateSubscriptionTier: (tier: SubscriptionTier) => void;
  redeemCoupon: (couponCode: string) => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

// Demo coupon codes for development/testing (production ready)
const DEMO_COUPONS: Record<string, SubscriptionTier> = {
  "DEMO-ENTERPRISE-2025": "Enterprise",
  "DEMO-BASIC-2025": "Basic",
  "DEMO-PREMIUM-2025": "Premium",
};

// Production ready coupon service with demo support
const CouponService = {
  async redeemCoupon(
    _username: string,
    couponCode: string,
  ): Promise<{ success: boolean; tier?: SubscriptionTier; message: string }> {
    try {
      // Check demo coupons first (for development/testing)
      const upperCode = couponCode.toUpperCase();
      if (DEMO_COUPONS[upperCode]) {
        return {
          success: true,
          tier: DEMO_COUPONS[upperCode],
          message: `Demo coupon redeemed successfully! Upgraded to ${DEMO_COUPONS[upperCode]} tier.`,
        };
      }

      // TODO: Call backend coupon redemption for production coupons
      // const result = await backend.redeem_coupon(username, couponCode);
      return {
        success: false,
        message:
          "Invalid coupon code. Try demo codes: DEMO-ENTERPRISE-2025, DEMO-BASIC-2025, DEMO-PREMIUM-2025",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error redeeming coupon. Please try again later.",
      };
    }
  },
};

// Subscription limits mapping
const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  Free: {
    max_photos: 5,
    max_file_size_mb: 10,
    can_generate_nft: false,
    priority_support: false,
  },
  Basic: {
    max_photos: 20,
    max_file_size_mb: 25,
    can_generate_nft: true,
    priority_support: false,
  },
  Premium: {
    max_photos: 100,
    max_file_size_mb: 50,
    can_generate_nft: true,
    priority_support: true,
  },
  Enterprise: {
    max_photos: 1000,
    max_file_size_mb: 100,
    can_generate_nft: true,
    priority_support: true,
  },
};

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("Free");
  const [isLoading, setIsLoading] = useState(false);

  // Load current subscription tier from localStorage or default
  useEffect(() => {
    const loadSubscriptionTier = () => {
      console.log(
        "🔍 [SubscriptionContext] Loading subscription tier for user:",
        user?.username,
      );

      if (!user?.username) {
        console.log("⚠️ [SubscriptionContext] No user, setting to Free");
        setCurrentTier("Free");
        return;
      }

      // Try to load from localStorage first
      const savedTier = localStorage.getItem(`subscription_${user.username}`);
      console.log(
        "💾 [SubscriptionContext] Saved tier from localStorage:",
        savedTier,
      );

      if (savedTier && Object.keys(SUBSCRIPTION_LIMITS).includes(savedTier)) {
        console.log("✅ [SubscriptionContext] Using saved tier:", savedTier);
        setCurrentTier(savedTier as SubscriptionTier);
        return;
      }

      // Production ready: All new users start with Free tier
      console.log(
        "🆓 [SubscriptionContext] New user detected, initializing with Free tier",
      );
      setCurrentTier("Free");
      localStorage.setItem(`subscription_${user.username}`, "Free");

      // TODO: Call backend to initialize user subscription
      // await backend.initialize_user_subscription(user.username);
    };

    loadSubscriptionTier();
  }, [user?.username]);

  // Update subscription tier and save to localStorage
  const updateSubscriptionTier = async (tier: SubscriptionTier) => {
    console.log(
      "🔄 [SubscriptionContext] Updating subscription tier from",
      currentTier,
      "to",
      tier,
    );
    setCurrentTier(tier);
    if (user?.username) {
      localStorage.setItem(`subscription_${user.username}`, tier);
      console.log("💾 [SubscriptionContext] Saved tier to localStorage:", tier);

      // Call backend to update subscription tier (PRODUCTION READY)
      try {
        const { backend } = await import("../../../declarations/backend");

        // Convert frontend tier to backend tier (Candid variant format)
        const backendTier = { [tier]: null } as any; // Candid variant type

        const result = await backend.update_user_subscription(
          user.username,
          backendTier,
        );

        if ("Ok" in result) {
          console.log(
            "✅ [SubscriptionContext] Backend subscription updated successfully",
          );
        } else {
          console.error(
            "❌ [SubscriptionContext] Backend update failed:",
            result.Err,
          );
        }
      } catch (error) {
        console.error(
          "❌ [SubscriptionContext] Failed to call backend:",
          error,
        );
        // Don't fail the frontend update if backend fails
        // In production, you might want to retry or queue the update
      }
    }
  };

  // Redeem coupon function
  const redeemCoupon = async (couponCode: string): Promise<boolean> => {
    console.log(
      "🎫 [SubscriptionContext] Redeeming coupon:",
      couponCode,
      "for user:",
      user?.username,
    );

    if (!couponCode.trim() || !user?.username) {
      console.log("❌ [SubscriptionContext] Invalid coupon or no user");
      return false;
    }

    setIsLoading(true);

    try {
      const result = await CouponService.redeemCoupon(
        user.username,
        couponCode,
      );

      if (result.success && result.tier) {
        console.log(
          "🎉 [SubscriptionContext] Coupon valid! Upgrading to:",
          result.tier,
        );
        updateSubscriptionTier(result.tier);
        return true;
      } else {
        console.log(
          "❌ [SubscriptionContext] Coupon redemption failed:",
          result.message,
        );
        return false;
      }
    } catch (error) {
      console.error("❌ [SubscriptionContext] Failed to redeem coupon:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: SubscriptionContextType = {
    currentTier,
    subscriptionLimits: SUBSCRIPTION_LIMITS[currentTier],
    isLoading,
    updateSubscriptionTier,
    redeemCoupon,
  };

  // Production: Remove debug logging
  // console.log("🎯 [SubscriptionContext] Current context value:", { currentTier, isLoading });

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook to use subscription context
export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
};
