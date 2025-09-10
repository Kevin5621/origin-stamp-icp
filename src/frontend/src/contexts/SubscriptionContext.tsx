"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  subscriptionService,
  type SubscriptionTier,
  type SubscriptionLimits,
  type SubscriptionPlan,
} from "@/services";

interface SubscriptionContextType {
  // Current subscription state
  currentSubscription: SubscriptionTier | null;
  subscriptionLimits: SubscriptionLimits | null;
  currentPlan: SubscriptionPlan | null;

  // Loading states
  isLoading: boolean;
  isUpgrading: boolean;
  isRedeeming: boolean;

  // Actions
  refreshSubscription: () => Promise<void>;
  upgradeSubscription: (tier: SubscriptionTier) => Promise<boolean>;
  redeemCoupon: (couponCode: string) => Promise<boolean>;

  // Helper methods
  canGenerateNFT: boolean;
  maxPhotos: number;
  maxFileSize: number;
  hasPrioritySupport: boolean;
  isSubscriptionActive: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();

  // State
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionTier | null>(null);
  const [subscriptionLimits, setSubscriptionLimits] =
    useState<SubscriptionLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Helper function to get plan by name
  const getPlanByName = useCallback((name: string) => {
    const plans = subscriptionService.getSubscriptionPlans();
    return plans.find((plan) => plan.tier === name) || null;
  }, []);

  // Computed values
  const currentPlan = currentSubscription
    ? getPlanByName(currentSubscription.name)
    : null;
  const canGenerateNFT = subscriptionLimits?.can_generate_nft || false;
  const maxPhotos = subscriptionLimits?.max_photos || 5;
  const maxFileSize = subscriptionLimits?.max_file_size_mb || 10;
  const hasPrioritySupport = subscriptionLimits?.priority_support || false;
  const isSubscriptionActive = currentSubscription !== null;

  const loadUserSubscription = useCallback(async () => {
    if (!user?.username) return;

    setIsLoading(true);
    try {
      const [subscription, limits] = await Promise.all([
        subscriptionService.getUserSubscription(user.username),
        subscriptionService.getUserSubscriptionLimits(user.username),
      ]);

      if (subscription) {
        const plan = getPlanByName(subscription);
        if (plan) {
          setCurrentSubscription({
            name: plan.tier,
            price: plan.price,
            currency: plan.currency,
            features: plan.features,
            limits: {
              maxPhotos: plan.limits.max_photos,
              maxFileSizeMB: plan.limits.max_file_size_mb,
              canGenerateNFT: plan.limits.can_generate_nft,
              prioritySupport: plan.limits.priority_support,
            },
          });
        }
      }
      setSubscriptionLimits(limits);
    } catch (error) {
      console.error("Failed to load user subscription:", error);
      // Only set to Free if this is the first load (no previous state)
      if (!hasLoadedOnce) {
        const freePlan = getPlanByName("Free");
        if (freePlan) {
          setCurrentSubscription({
            name: "Free",
            price: freePlan.price,
            currency: freePlan.currency,
            features: freePlan.features,
            limits: {
              maxPhotos: freePlan.limits.max_photos,
              maxFileSizeMB: freePlan.limits.max_file_size_mb,
              canGenerateNFT: freePlan.limits.can_generate_nft,
              prioritySupport: freePlan.limits.priority_support,
            },
          });
          setSubscriptionLimits(freePlan.limits);
        }
      }
    } finally {
      setIsLoading(false);
      setHasLoadedOnce(true);
    }
  }, [user?.username, getPlanByName, hasLoadedOnce]);

  // Load user subscription on mount and when user changes
  useEffect(() => {
    if (user?.username) {
      loadUserSubscription();
    } else {
      setCurrentSubscription(null);
      setSubscriptionLimits(null);
      setIsLoading(false);
    }
  }, [user?.username, loadUserSubscription]);

  const refreshSubscription = useCallback(async () => {
    await loadUserSubscription();
  }, [loadUserSubscription]);

  const upgradeSubscription = useCallback(
    async (tier: SubscriptionTier): Promise<boolean> => {
      if (!user?.username) return false;

      setIsUpgrading(true);
      try {
        const success = await subscriptionService.updateUserSubscription(
          user.username,
          tier,
        );
        if (success) {
          await loadUserSubscription(); // Refresh data
        }
        return success;
      } catch (error) {
        console.error("Failed to upgrade subscription:", error);
        return false;
      } finally {
        setIsUpgrading(false);
      }
    },
    [user?.username, loadUserSubscription],
  );

  const redeemCoupon = useCallback(
    async (couponCode: string): Promise<boolean> => {
      if (!user?.username) return false;

      setIsRedeeming(true);
      try {
        const success = await subscriptionService.redeemCoupon(
          user.username,
          couponCode,
        );
        if (success) {
          await loadUserSubscription(); // Refresh data
        }
        return success;
      } catch (error) {
        console.error("Failed to redeem coupon:", error);
        return false;
      } finally {
        setIsRedeeming(false);
      }
    },
    [user?.username, loadUserSubscription],
  );

  const value: SubscriptionContextType = useMemo(
    () => ({
      // Current subscription state
      currentSubscription,
      subscriptionLimits,
      currentPlan,

      // Loading states
      isLoading,
      isUpgrading,
      isRedeeming,

      // Actions
      refreshSubscription,
      upgradeSubscription,
      redeemCoupon,

      // Helper methods
      canGenerateNFT,
      maxPhotos,
      maxFileSize,
      hasPrioritySupport,
      isSubscriptionActive,
    }),
    [
      currentSubscription,
      subscriptionLimits,
      currentPlan,
      isLoading,
      isUpgrading,
      isRedeeming,
      refreshSubscription,
      upgradeSubscription,
      redeemCoupon,
      canGenerateNFT,
      maxPhotos,
      maxFileSize,
      hasPrioritySupport,
      isSubscriptionActive,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
};
