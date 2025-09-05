"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  subscriptionService,
  type SubscriptionTier,
  type SubscriptionLimits,
  type SubscriptionPlan,
} from "@/services/subscriptionService";

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

  // Computed values
  const currentPlan = currentSubscription
    ? subscriptionService.getSubscriptionPlan(currentSubscription)
    : null;
  const canGenerateNFT = subscriptionLimits?.can_generate_nft || false;
  const maxPhotos = subscriptionLimits?.max_photos || 5;
  const maxFileSize = subscriptionLimits?.max_file_size_mb || 10;
  const hasPrioritySupport = subscriptionLimits?.priority_support || false;
  const isSubscriptionActive = currentSubscription !== null;

  // Load user subscription on mount and when user changes
  useEffect(() => {
    if (user?.username) {
      loadUserSubscription();
    } else {
      setCurrentSubscription(null);
      setSubscriptionLimits(null);
      setIsLoading(false);
    }
  }, [user?.username]);

  const loadUserSubscription = async () => {
    if (!user?.username) return;

    setIsLoading(true);
    try {
      const [subscription, limits] = await Promise.all([
        subscriptionService.getUserSubscription(user.username),
        subscriptionService.getUserSubscriptionLimits(user.username),
      ]);

      setCurrentSubscription(subscription);
      setSubscriptionLimits(limits);
    } catch (error) {
      console.error("Failed to load user subscription:", error);
      // Only set to Free if this is the first load (no previous state)
      if (currentSubscription === null) {
        setCurrentSubscription("Free");
        setSubscriptionLimits(
          subscriptionService.getSubscriptionPlan("Free")?.limits || null,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await loadUserSubscription();
  };

  const upgradeSubscription = async (
    tier: SubscriptionTier,
  ): Promise<boolean> => {
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
  };

  const redeemCoupon = async (couponCode: string): Promise<boolean> => {
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
  };

  const value: SubscriptionContextType = {
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
  };

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
