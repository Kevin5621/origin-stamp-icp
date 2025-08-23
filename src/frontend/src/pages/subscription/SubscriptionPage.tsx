import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Check,
  Star,
  Users,
  Camera,
  Sparkles,
  Loader,
  ArrowRight,
  Info,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";
import { useSubscription } from "../../contexts/SubscriptionContext";

// Subscription tier configuration
interface SubscriptionTierConfig {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  icon: React.ComponentType<any>;
  popular?: boolean;
  features: string[];
  limits: {
    max_photos: number;
    max_file_size_mb: number;
    can_generate_nft: boolean;
    priority_support: boolean;
  };
  color: string;
  gradient: string;
}

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToastContext();
  const { currentTier, redeemCoupon, isLoading } = useSubscription();

  // Local state for coupon input
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponMessage, setCouponMessage] = useState<string>("");

  // Demo coupon codes for testing
  const demoCoupons = [
    "DEMO-ENTERPRISE-2025",
    "DEMO-BASIC-2025",
    "DEMO-PREMIUM-2025",
  ];

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim() || !user?.username) {
      setCouponMessage("Please enter a coupon code");
      return;
    }

    setCouponMessage("");

    try {
      const success = await redeemCoupon(couponCode);

      if (success) {
        setCouponMessage(
          "🎉 Coupon redeemed successfully! Your subscription has been upgraded.",
        );
        addToast("success", "Coupon redeemed successfully!");
        setCouponCode("");
      } else {
        setCouponMessage(
          "❌ Invalid coupon code. Try one of the demo codes above.",
        );
        addToast("error", "Invalid coupon code");
      }
    } catch (error) {
      setCouponMessage("❌ Failed to redeem coupon. Please try again.");
      addToast("error", "Failed to redeem coupon");
    }
  };

  // Subscription tiers configuration
  const subscriptionTiers: SubscriptionTierConfig[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      currency: "USD",
      period: "month",
      description: "Perfect for trying out OriginStamp",
      icon: Users,
      features: [
        "5 photos per session",
        "10MB file size limit",
        "Community support",
        "Basic verification",
      ],
      limits: {
        max_photos: 5,
        max_file_size_mb: 10,
        can_generate_nft: false,
        priority_support: false,
      },
      color: "gray",
      gradient: "from-gray-400 to-gray-600",
    },
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      currency: "USD",
      period: "month",
      description: "Great for regular creators",
      icon: Camera,
      popular: true,
      features: [
        "20 photos per session",
        "25MB file size limit",
        "NFT generation",
        "Email support",
        "Advanced analytics",
      ],
      limits: {
        max_photos: 20,
        max_file_size_mb: 25,
        can_generate_nft: true,
        priority_support: false,
      },
      color: "blue",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      id: "premium",
      name: "Premium",
      price: 29.99,
      currency: "USD",
      period: "month",
      description: "Perfect for professional creators",
      icon: Sparkles,
      features: [
        "100 photos per session",
        "50MB file size limit",
        "NFT generation",
        "Priority support",
        "Advanced features",
        "Custom branding",
      ],
      limits: {
        max_photos: 100,
        max_file_size_mb: 50,
        can_generate_nft: true,
        priority_support: true,
      },
      color: "purple",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99.99,
      currency: "USD",
      period: "month",
      description: "For teams and organizations",
      icon: Crown,
      features: [
        "Unlimited photos",
        "100MB file size limit",
        "NFT generation",
        "Priority support",
        "API access",
        "White label solution",
        "Dedicated support",
      ],
      limits: {
        max_photos: 1000,
        max_file_size_mb: 100,
        can_generate_nft: true,
        priority_support: true,
      },
      color: "gold",
      gradient: "from-yellow-500 to-orange-600",
    },
  ];

  const handleUpgrade = async (_tierName: string) => {
    if (!user) {
      addToast("error", "Please log in to upgrade your subscription");
      navigate("/login");
      return;
    }

    addToast("info", "Upgrade functionality coming soon!");
  };

  const getTierButtonText = (tier: SubscriptionTierConfig) => {
    if (currentTier === tier.name) {
      return "Current Plan";
    }

    if (tier.name === "Free") {
      return "Downgrade to Free";
    }

    return `Upgrade to ${tier.name}`;
  };

  const getTierButtonVariant = (tier: SubscriptionTierConfig) => {
    if (currentTier === tier.name) {
      return "current";
    }

    if (tier.popular) {
      return "popular";
    }

    return "default";
  };

  const isCurrentTier = (tierName: string) => currentTier === tierName;
  const isLoadingTier = (_tierName: string) => false; // Simplified for now

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        {/* Header Section */}
        <div className="subscription-header">
          <div className="subscription-header__content">
            <h1 className="subscription-title">
              <Crown className="subscription-title-icon" />
              Choose Your Plan
            </h1>
            <p className="subscription-subtitle">
              Unlock more features and grow your creative journey with
              OriginStamp
            </p>

            {/* Current Plan Indicator */}
            <div className="current-plan-indicator">
              <Info className="current-plan-icon" />
              <span className="current-plan-text">
                Current Plan: <strong>{currentTier}</strong>
              </span>
            </div>

            {/* Coupon Section */}
            <div className="coupon-section">
              <div className="coupon-section__header">
                <Sparkles className="coupon-section__icon" />
                <h3>Have a Coupon?</h3>
              </div>
              <div className="coupon-section__content">
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        couponCode.trim() &&
                        !isLoading
                      ) {
                        handleRedeemCoupon();
                      }
                    }}
                    className="coupon-input"
                    disabled={isLoading}
                    aria-label="Enter coupon code to upgrade your subscription"
                  />
                  <button
                    onClick={handleRedeemCoupon}
                    disabled={!couponCode.trim() || isLoading}
                    className="coupon-redeem-btn"
                    aria-label="Redeem coupon code"
                  >
                    {isLoading ? (
                      <Loader className="coupon-redeem-btn__loader" />
                    ) : (
                      "Redeem"
                    )}
                  </button>
                </div>

                {couponMessage && (
                  <div
                    className={`coupon-message ${couponMessage.includes("🎉") ? "success" : "error"}`}
                  >
                    {couponMessage}
                  </div>
                )}

                {/* Demo Coupon Codes */}
                <div className="demo-coupons">
                  <p className="demo-coupons__title">
                    Demo Coupons (for testing):
                  </p>
                  <div className="demo-coupons__list">
                    {demoCoupons.map((code) => (
                      <button
                        key={code}
                        onClick={() => setCouponCode(code)}
                        className="demo-coupon-code"
                        title="Click to copy"
                        aria-label={`Use demo coupon code: ${code}`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="subscription-grid">
          {subscriptionTiers.map((tier) => {
            const IconComponent = tier.icon;
            const isCurrent = isCurrentTier(tier.name);
            const isLoading = isLoadingTier(tier.name);

            return (
              <div
                key={tier.id}
                className={`subscription-card ${tier.popular ? "subscription-card--popular" : ""} ${isCurrent ? "subscription-card--current" : ""}`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="subscription-badge">
                    <Star className="subscription-badge-icon" />
                    Most Popular
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="subscription-current-badge">
                    <Check className="subscription-current-icon" />
                    Current Plan
                  </div>
                )}

                {/* Card Header */}
                <div className="subscription-card-header">
                  <div
                    className={`subscription-icon subscription-icon--${tier.color}`}
                  >
                    <IconComponent size={32} />
                  </div>
                  <h3 className="subscription-card-title">{tier.name}</h3>
                  <p className="subscription-card-description">
                    {tier.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="subscription-pricing">
                  <div className="subscription-price">
                    <span className="subscription-currency">$</span>
                    <span className="subscription-amount">{tier.price}</span>
                    <span className="subscription-period">/{tier.period}</span>
                  </div>
                  {tier.price > 0 && (
                    <div className="subscription-billing">Billed monthly</div>
                  )}
                </div>

                {/* Features List */}
                <div className="subscription-features">
                  <ul className="subscription-features-list">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="subscription-feature">
                        <Check className="subscription-feature-icon" />
                        <span className="subscription-feature-text">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="subscription-action">
                  <button
                    className={`subscription-button subscription-button--${getTierButtonVariant(tier)}`}
                    onClick={() => handleUpgrade(tier.name)}
                    disabled={isCurrent || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="subscription-button-icon animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {!isCurrent && (
                          <ArrowRight className="subscription-button-icon" />
                        )}
                        {getTierButtonText(tier)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
