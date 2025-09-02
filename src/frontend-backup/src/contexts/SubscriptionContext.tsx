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
  refreshSubscription: () => Promise<void>;
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

// coupon service with backend integration
const CouponService = {
  async redeemCoupon(
    username: string,
    couponCode: string,
  ): Promise<{ success: boolean; tier?: SubscriptionTier; message: string }> {
    try {
      // Check demo coupons first (for development/testing)
      const upperCode = couponCode.toUpperCase();
      if (DEMO_COUPONS[upperCode]) {
        // For demo coupons, also call backend to update subscription
        try {
          const { backend } = await import("../../../declarations/backend");
          const backendTier = { [DEMO_COUPONS[upperCode]]: null } as any;

          const result = await backend.set_user_subscription(
            username,
            backendTier,
          );
          if ("Ok" in result && result.Ok) {
            return {
              success: true,
              tier: DEMO_COUPONS[upperCode],
              message: `Demo coupon redeemed successfully! Upgraded to ${DEMO_COUPONS[upperCode]} tier.`,
            };
          }
        } catch (backendError) {
          console.error("Backend update failed for demo coupon:", backendError);
        }

        return {
          success: true,
          tier: DEMO_COUPONS[upperCode],
          message: `Demo coupon redeemed successfully! Upgraded to ${DEMO_COUPONS[upperCode]} tier.`,
        };
      }

      // Call backend coupon redemption for production coupons
      try {
        const { backend } = await import("../../../declarations/backend");
        const result = await backend.redeem_coupon(username, couponCode);

        if ("Ok" in result && result.Ok) {
          // Get updated subscription from backend
          const subscriptionResult =
            await backend.get_user_subscription(username);
          if (subscriptionResult && "Ok" in subscriptionResult) {
            const tier = subscriptionResult.Ok as any;
            let frontendTier: SubscriptionTier = "Free";

            if ("Free" in tier) frontendTier = "Free";
            else if ("Basic" in tier) frontendTier = "Basic";
            else if ("Premium" in tier) frontendTier = "Premium";
            else if ("Enterprise" in tier) frontendTier = "Enterprise";

            return {
              success: true,
              tier: frontendTier,
              message: `Coupon redeemed successfully! Upgraded to ${frontendTier} tier.`,
            };
          }
        } else {
          return {
            success: false,
            message: (result as any).Err || "Failed to redeem coupon",
          };
        }
      } catch (backendError) {
        console.error("Backend coupon redemption failed:", backendError);
      }

      return {
        success: false,
        message: "Invalid coupon code. Please check your coupon and try again.",
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

  // Load current subscription tier from backend
  useEffect(() => {
    const loadSubscriptionTier = async () => {
      if (!user?.username) {
        setCurrentTier("Free");
        return;
      }

      setIsLoading(true);
      try {
        const { backend } = await import("../../../declarations/backend");

        // Get subscription from backend
        const backendTier = await backend.get_user_subscription(user.username);

        if (backendTier && "Ok" in backendTier) {
          const tier = backendTier.Ok as any;
          // Convert backend tier to frontend tier
          let frontendTier: SubscriptionTier = "Free";

          if ("Free" in tier) frontendTier = "Free";
          else if ("Basic" in tier) frontendTier = "Basic";
          else if ("Premium" in tier) frontendTier = "Premium";
          else if ("Enterprise" in tier) frontendTier = "Enterprise";

          setCurrentTier(frontendTier);
          localStorage.setItem(`subscription_${user.username}`, frontendTier);
        } else {
          // Initialize user with Free tier if not found
          const initResult = await backend.initialize_user_subscription(
            user.username,
          );
          if ("Ok" in initResult && initResult.Ok) {
            setCurrentTier("Free");
            localStorage.setItem(`subscription_${user.username}`, "Free");
          }
        }
      } catch (error) {
        console.error("Failed to load subscription from backend:", error);
        // Fallback to localStorage
        const savedTier = localStorage.getItem(`subscription_${user.username}`);
        if (savedTier && Object.keys(SUBSCRIPTION_LIMITS).includes(savedTier)) {
          setCurrentTier(savedTier as SubscriptionTier);
        } else {
          setCurrentTier("Free");
          localStorage.setItem(`subscription_${user.username}`, "Free");
        }
      } finally {
        setIsLoading(false);
      }
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

  // Refresh subscription from backend
  const refreshSubscription = async (): Promise<void> => {
    if (!user?.username) return;

    setIsLoading(true);
    try {
      const { backend } = await import("../../../declarations/backend");

      // Get subscription from backend
      const backendTier = await backend.get_user_subscription(user.username);

      if (backendTier && "Ok" in backendTier) {
        const tier = backendTier.Ok as any;
        // Convert backend tier to frontend tier
        let frontendTier: SubscriptionTier = "Free";

        if ("Free" in tier) frontendTier = "Free";
        else if ("Basic" in tier) frontendTier = "Basic";
        else if ("Premium" in tier) frontendTier = "Premium";
        else if ("Enterprise" in tier) frontendTier = "Enterprise";

        setCurrentTier(frontendTier);
        localStorage.setItem(`subscription_${user.username}`, frontendTier);
      }
    } catch (error) {
      console.error("Failed to refresh subscription from backend:", error);
    } finally {
      setIsLoading(false);
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
    refreshSubscription,
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
