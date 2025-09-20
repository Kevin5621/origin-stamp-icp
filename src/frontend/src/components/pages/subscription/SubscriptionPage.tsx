"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Zap, CreditCard, Wallet, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToastContext } from "@/contexts/ToastContext";
import { subscriptionService, type SubscriptionPlan } from "@/services";

export const SubscriptionPage: React.FC = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToastContext();
  const {
    currentSubscription,
    currentPlan,
    isLoading,
    isUpgrading,
    isRedeeming,
    upgradeSubscription,
    redeemCoupon,
  } = useSubscription();

  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"icp" | "usd">("icp");

  const plans = subscriptionService.getSubscriptionPlans();

  const planImages = {
    Free: "/landing/free.webp",
    Basic: "/landing/basic.webp",
    Premium: "/landing/premium.webp",
    Enterprise: "/landing/enterprise.webp",
  };

  useEffect(() => {
    const planParam = searchParams?.get("plan");
    if (planParam) {
      // Handle plan selection if needed
      console.log("Selected plan:", planParam);
    }
  }, [searchParams]);

  const handleRedeemCoupon = async () => {
    if (!user?.username || !couponCode.trim()) {
      showError("Please enter a valid coupon code");
      return;
    }

    try {
      const success = await redeemCoupon(couponCode.trim());

      if (success) {
        showSuccess("Coupon redeemed successfully!");
        setCouponCode("");
      } else {
        showError("Invalid or expired coupon code");
      }
    } catch {
      showError("Failed to redeem coupon. Please try again.");
    }
  };

  const handleUpgradeSubscription = async (plan: SubscriptionPlan) => {
    if (!user?.username) {
      showError("Please log in to upgrade your subscription");
      return;
    }

    try {
      const subscriptionTier = {
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
      };
      const success = await upgradeSubscription(subscriptionTier);

      if (success) {
        showSuccess(`Successfully upgraded to ${plan.name} plan!`);
      } else {
        showError("Failed to upgrade subscription. Please try again.");
      }
    } catch {
      showError("Failed to upgrade subscription. Please try again.");
    }
  };

  const getPlanPrice = (plan: SubscriptionPlan) => {
    if (plan.tier === "Free") return "Free";

    const icpPrices = {
      Basic: "2.5 ICP",
      Premium: "7.5 ICP",
      Enterprise: "25 ICP",
    };

    const usdPrices = {
      Basic: "$9.99",
      Premium: "$29.99",
      Enterprise: "$99.99",
    };

    return paymentMethod === "icp"
      ? icpPrices[plan.tier as keyof typeof icpPrices]
      : usdPrices[plan.tier as keyof typeof usdPrices];
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto overflow-visible px-4 py-12">
      {/* Minimalist Header */}
      <div className="mb-16 text-center">
        <h1 className="text-foreground mb-4 text-4xl font-light tracking-tight">
          Subscription
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Choose the perfect plan for your art authentication needs
        </p>
      </div>

      {/* Current Plan Status - Minimalist */}
      {currentPlan && (
        <div className="mb-12 text-center">
          <div className="bg-primary/10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <Crown className="text-primary h-4 w-4" />
            <span className="text-primary font-medium">
              Current: {currentPlan.name}
            </span>
          </div>
        </div>
      )}

      {/* Payment Method - Minimalist */}
      <div className="mb-12 flex justify-center">
        <Tabs
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as "icp" | "usd")}
          className="w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="icp" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              ICP
            </TabsTrigger>
            <TabsTrigger value="usd" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              USD
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Plans Grid - With Background Images */}
      <div className="mb-16 grid gap-8 overflow-visible md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan: SubscriptionPlan) => {
          const isCurrentPlan = currentSubscription?.name === plan.tier;
          const isUpgrade =
            currentSubscription && plan.tier !== currentSubscription.name;

          return (
            <div
              key={plan.tier}
              className={`group relative h-full overflow-visible rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-primary scale-105 shadow-lg"
                  : isCurrentPlan
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/30"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <Image
                  src={planImages[plan.tier as keyof typeof planImages]}
                  alt={`${plan.name} plan`}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    isCurrentPlan
                      ? "opacity-40 group-hover:opacity-60"
                      : "opacity-25 group-hover:opacity-50"
                  }`}
                />
                <div className="bg-background/85 group-hover:bg-background/75 absolute inset-0 transition-colors duration-300" />
              </div>

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-lg">
                    <Crown className="mr-1 h-3 w-3" />
                    Popular
                  </Badge>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge className="bg-green-500 text-white shadow-lg">
                    Current
                  </Badge>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col p-8">
                {/* Plan Header */}
                <div className="mb-8 text-center">
                  <h3 className="text-foreground mb-3 text-2xl font-light">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-foreground text-4xl font-light">
                      {getPlanPrice(plan)}
                    </span>
                    {plan.tier !== "Free" && (
                      <span className="text-muted-foreground text-sm">
                        /month
                      </span>
                    )}
                  </div>
                </div>

                {/* Features - Minimalist List */}
                <div className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-primary mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"></div>
                      <span className="text-muted-foreground text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Limits - Clean Grid */}
                <div className="bg-muted/40 mb-8 grid grid-cols-1 gap-3 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Photos</span>
                    <span className="text-foreground font-medium">
                      {plan.limits.max_photos === -1
                        ? "∞"
                        : plan.limits.max_photos}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">File Size</span>
                    <span className="text-foreground font-medium">
                      {plan.limits.max_file_size_mb}MB
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      NFT Generation
                    </span>
                    <span className="text-foreground font-medium">
                      {plan.limits.can_generate_nft ? "✓" : "✗"}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant={plan.popular ? "primary" : "outline"}
                  onClick={() => handleUpgradeSubscription(plan)}
                  disabled={isUpgrading || isCurrentPlan}
                >
                  {isCurrentPlan ? (
                    "Current Plan"
                  ) : isUpgrading ? (
                    "Upgrading..."
                  ) : (
                    <>
                      {isUpgrade ? "Upgrade" : "Get Started"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon Section - Minimalist */}
      <div className="mb-16 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-foreground mb-4 text-lg font-medium">
            Have a coupon?
          </h3>
          <div className="flex gap-3">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleRedeemCoupon}
              disabled={isRedeeming || !couponCode.trim()}
              variant="outline"
            >
              {isRedeeming ? "..." : "Redeem"}
            </Button>
          </div>
        </div>
      </div>

      {/* Support - Minimalist */}
      <div className="text-center">
        <p className="text-muted-foreground mb-4 text-sm">
          Need help choosing?
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="ghost" size="sm">
            Contact Support
          </Button>
          <Button variant="ghost" size="sm">
            <Zap className="mr-2 h-4 w-4" />
            Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};
