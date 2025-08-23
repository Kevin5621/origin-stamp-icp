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

// Demo coupon codes for development/testing
const DEMO_COUPONS: Record<string, SubscriptionTier> = {
  "DEMO-ENTERPRISE-2025": "Enterprise",
  "DEMO-BASIC-2025": "Basic",
  "DEMO-PREMIUM-2025": "Premium",
};

// coupon service with demo support
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
      if (!user?.username) {
        setCurrentTier("Free");
        return;
      }

      // Try to load from localStorage first
      const savedTier = localStorage.getItem(`subscription_${user.username}`);

      if (savedTier && Object.keys(SUBSCRIPTION_LIMITS).includes(savedTier)) {
        setCurrentTier(savedTier as SubscriptionTier);
        return;
      }

      // All new users start with Free tier
      setCurrentTier("Free");
      localStorage.setItem(`subscription_${user.username}`, "Free");

      // TODO: Call backend to initialize user subscription
      // await backend.initialize_user_subscription(user.username);
    };

    loadSubscriptionTier();
  }, [user?.username]);

  // Update subscription tier and save to localStorage
  const updateSubscriptionTier = async (tier: SubscriptionTier) => {
    setCurrentTier(tier);
    if (user?.username) {
      localStorage.setItem(`subscription_${user.username}`, tier);

      // Call backend to update subscription tier
      try {
        const { backend } = await import("../../../declarations/backend");

        // Convert frontend tier to backend tier (Candid variant format)
        const backendTier = { [tier]: null } as any; // Candid variant type

        const result = await backend.update_user_subscription(
          user.username,
          backendTier,
        );

        if ("Ok" in result) {
          // Backend subscription updated successfully
        } else {
          console.error("Backend update failed:", result.Err);
          // Log failed update for monitoring
          console.warn("Backend update failed, will retry on next sync");
        }
      } catch (error) {
        console.error("Failed to call backend:", error);
        // Log failed update for monitoring
        console.warn("Backend update failed, will retry on next sync");
      }
    }
  };

  // Redeem coupon function
  const redeemCoupon = async (couponCode: string): Promise<boolean> => {
    // Input validation and sanitization
    if (!couponCode || typeof couponCode !== "string") {
      console.error("Invalid coupon code type");
      return false;
    }

    const sanitizedCode = couponCode.trim();
    if (
      !sanitizedCode ||
      sanitizedCode.length < 3 ||
      sanitizedCode.length > 50
    ) {
      console.error("Invalid coupon code length");
      return false;
    }

    // Security check - prevent injection attacks
    if (!/^[A-Za-z0-9\-_]+$/.test(sanitizedCode)) {
      console.error("Invalid coupon code format");
      return false;
    }

    if (!user?.username) {
      console.error("No authenticated user");
      return false;
    }

    setIsLoading(true);

    try {
      const result = await CouponService.redeemCoupon(
        user.username,
        couponCode,
      );

      if (result.success && result.tier) {
        updateSubscriptionTier(result.tier);
        return true;
      } else {
        console.log("Coupon redemption failed:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Failed to redeem coupon:", error);
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
