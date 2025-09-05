"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, Zap, Gift, CreditCard, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToastContext } from "@/contexts/ToastContext";
import {
  subscriptionService,
  type SubscriptionPlan,
} from "@/services/subscriptionService";

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

  useEffect(() => {
    const planParam = searchParams.get("plan");
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
      const success = await upgradeSubscription(plan.tier);

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
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">
            Loading subscription information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-foreground text-2xl font-bold">
            Subscription Management
          </h2>
          <p className="text-muted-foreground">
            Upgrade your plan to unlock more features and increase your art
            authentication capabilities
          </p>
        </div>
      </div>

      {/* Current Subscription Status */}
      {currentPlan && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Crown className="text-primary mr-2 h-5 w-5" />
              Current Plan: {currentPlan.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {currentPlan.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="bg-background rounded-lg p-4">
                <div className="text-foreground mb-1 text-2xl font-light">
                  {currentPlan.limits.max_photos}
                </div>
                <div className="text-muted-foreground text-sm">
                  Photos per session
                </div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="text-foreground mb-1 text-2xl font-light">
                  {currentPlan.limits.max_file_size_mb}MB
                </div>
                <div className="text-muted-foreground text-sm">
                  File size limit
                </div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="text-foreground mb-1 text-2xl font-light">
                  {currentPlan.limits.can_generate_nft ? "✓" : "✗"}
                </div>
                <div className="text-muted-foreground text-sm">
                  NFT generation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coupon Redemption */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Gift className="text-primary mr-2 h-5 w-5" />
            Redeem Coupon
          </CardTitle>
          <CardDescription>
            Have a coupon code? Redeem it to upgrade your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleRedeemCoupon}
              disabled={isRedeeming || !couponCode.trim()}
            >
              {isRedeeming ? "Redeeming..." : "Redeem"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as "icp" | "usd")}
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
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-foreground mb-6 text-xl font-semibold">
          Available Plans
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription === plan.tier;
            const isUpgrade =
              currentSubscription && plan.tier !== currentSubscription;

            return (
              <Card
                key={plan.tier}
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? "border-primary scale-105 shadow-lg"
                    : isCurrentPlan
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      <Crown className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <Badge className="bg-green-500 px-3 py-1 text-white">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4 text-center">
                  <CardTitle className="text-foreground text-2xl font-medium">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-foreground text-3xl font-light">
                      {getPlanPrice(plan)}
                    </span>
                    {plan.tier !== "Free" && (
                      <span className="text-muted-foreground text-sm">
                        /month
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="bg-primary/10 rounded-full p-1">
                          <Check className="text-primary h-3 w-3" />
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  {isCurrentPlan ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleUpgradeSubscription(plan)}
                      disabled={isUpgrading}
                    >
                      {isUpgrading
                        ? "Upgrading..."
                        : isUpgrade
                          ? "Upgrade"
                          : "Get Started"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground text-xl">Need Help?</CardTitle>
          <CardDescription>
            Our support team is here to help you with any subscription
            questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="outline" className="px-8">
              Contact Support
            </Button>
            <Button className="px-8">
              <Zap className="mr-2 h-4 w-4" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
