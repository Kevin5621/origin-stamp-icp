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

// Demo coupon codes for testing
const DEMO_COUPONS: Record<string, SubscriptionTier> = {
  "DEMO-ENTERPRISE-2025": "Enterprise",
  "DEMO-BASIC-2025": "Basic",
  "DEMO-PREMIUM-2025": "Premium",
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

      // Fallback to mock data based on username
      if (user.username === "admin_user") {
        setCurrentTier("Enterprise");
        localStorage.setItem(`subscription_${user.username}`, "Enterprise");
      } else if (user.username === "test_user") {
        setCurrentTier("Basic");
        localStorage.setItem(`subscription_${user.username}`, "Basic");
      } else {
        setCurrentTier("Free");
        localStorage.setItem(`subscription_${user.username}`, "Free");
      }
    };

    loadSubscriptionTier();
  }, [user?.username]);

  // Update subscription tier and save to localStorage
  const updateSubscriptionTier = (tier: SubscriptionTier) => {
    setCurrentTier(tier);
    if (user?.username) {
      localStorage.setItem(`subscription_${user.username}`, tier);
    }
  };

  // Redeem coupon function
  const redeemCoupon = async (couponCode: string): Promise<boolean> => {
    if (!couponCode.trim() || !user?.username) {
      return false;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const upperCode = couponCode.toUpperCase();
      if (DEMO_COUPONS[upperCode]) {
        const newTier = DEMO_COUPONS[upperCode];
        updateSubscriptionTier(newTier);
        return true;
      }

      return false;
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
