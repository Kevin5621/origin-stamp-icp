import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  ArrowLeft,
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
  const { t } = useTranslation("subscription");
  const { user } = useAuth();
  const { addToast } = useToastContext();
  const { currentTier, redeemCoupon, isLoading } = useSubscription();

  // Local state for coupon input
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponMessage, setCouponMessage] = useState<string>("");

  // Demo coupon codes for development/testing
  // const demoCoupons = [
  //   "DEMO-ENTERPRISE-2025",
  //   "DEMO-BASIC-2025",
  //   "DEMO-PREMIUM-2025",
  // ];

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim() || !user?.username) {
      setCouponMessage(t("please_enter_coupon_code"));
      return;
    }

    setCouponMessage("");

    try {
      const success = await redeemCoupon(couponCode);

      if (success) {
        setCouponMessage(t("coupon_redeemed_successfully"));
        addToast("success", t("coupon_redeemed_successfully"));
        setCouponCode("");
      } else {
        setCouponMessage(t("invalid_coupon_code"));
        addToast("error", t("invalid_coupon_code"));
      }
    } catch (error) {
      setCouponMessage(t("failed_to_redeem_coupon"));
      addToast("error", t("failed_to_redeem_coupon"));
    }
  };

  // Subscription tiers configuration
  const subscriptionTiers: SubscriptionTierConfig[] = [
    {
      id: "free",
      name: t("tiers.free.name"),
      price: 0,
      currency: "USD",
      period: "month",
      description: t("tiers.free.description"),
      icon: Users,
      features: t("tiers.free.features", { returnObjects: true }) as string[],
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
      name: t("tiers.basic.name"),
      price: 9.99,
      currency: "USD",
      period: "month",
      description: t("tiers.basic.description"),
      icon: Camera,
      popular: true,
      features: t("tiers.basic.features", { returnObjects: true }) as string[],
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
      name: t("tiers.premium.name"),
      price: 29.99,
      currency: "USD",
      period: "month",
      description: t("tiers.premium.description"),
      icon: Sparkles,
      features: t("tiers.premium.features", {
        returnObjects: true,
      }) as string[],
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
      name: t("tiers.enterprise.name"),
      price: 99.99,
      currency: "USD",
      period: "month",
      description: t("tiers.enterprise.description"),
      icon: Crown,
      features: t("tiers.enterprise.features", {
        returnObjects: true,
      }) as string[],
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
      addToast("error", t("please_login_to_upgrade"));
      navigate("/login");
      return;
    }

    addToast("info", t("upgrade_functionality_coming_soon"));
  };

  const getTierButtonText = (tier: SubscriptionTierConfig) => {
    if (currentTier === tier.name) {
      return t("current_plan_badge");
    }

    if (tier.name === t("tiers.free.name")) {
      return t("downgrade_to_free");
    }

    return `${t("upgrade_to")} ${tier.name}`;
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
    <div className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__main">
          {/* Header Section */}
          <div className="dashboard__section">
            <div className="dashboard__header">
              <button
                className="subscription-back-btn"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft size={20} />
                {t("back_to_dashboard")}
              </button>
              <h1 className="dashboard__title">
                <Crown size={32} className="subscription-crown-icon" />
                {t("subscription_plans")}
              </h1>
              <p className="dashboard__subtitle">
                {t("subscription_subtitle")}
              </p>
            </div>
          </div>

          {/* Current Plan Status */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <div className="subscription-current-plan">
                  <div className="subscription-current-plan__info">
                    <Info
                      size={20}
                      className="subscription-current-plan__icon"
                    />
                    <span className="subscription-current-plan__title">
                      {t("current_plan")}: {currentTier}
                    </span>
                  </div>
                  {currentTier !== "Free" && (
                    <span className="subscription-badge subscription-badge--premium">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">
                  <Sparkles size={20} className="subscription-sparkles-icon" />
                  {t("have_coupon_code")}
                </h2>
              </div>
              <div className="dashboard-card__content">
                <div className="subscription-coupon">
                  <div className="subscription-coupon__input-group">
                    <input
                      type="text"
                      placeholder={t("enter_coupon_code")}
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
                      className="subscription-coupon__input"
                      disabled={isLoading}
                      aria-label={t("enter_coupon_code_aria")}
                    />
                    <button
                      onClick={handleRedeemCoupon}
                      disabled={!couponCode.trim() || isLoading}
                      className="subscription-coupon__button"
                      aria-label={t("redeem_coupon_code_aria")}
                    >
                      {isLoading ? (
                        <>
                          <Loader
                            size={16}
                            className="subscription-coupon__loader"
                          />
                          {t("processing")}
                        </>
                      ) : (
                        t("redeem")
                      )}
                    </button>
                  </div>

                  {couponMessage && (
                    <div
                      className={`subscription-coupon__message ${
                        couponMessage.includes(
                          t("coupon_redeemed_successfully").split("!")[0],
                        )
                          ? "subscription-coupon__message--success"
                          : "subscription-coupon__message--error"
                      }`}
                    >
                      {couponMessage}
                    </div>
                  )}

                  {/* Demo Coupon Codes
                  <div className="subscription-demo-coupons">
                    <p className="subscription-demo-coupons__title">
                      Demo Coupons (for testing):
                    </p>
                    <div className="subscription-demo-coupons__list">
                      {demoCoupons.map((code) => (
                        <button
                          key={code}
                          onClick={() => setCouponCode(code)}
                          className="subscription-demo-coupon__code"
                          title="Click to use"
                          aria-label={`Use demo coupon code: ${code}`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Plans Grid */}
          <div className="dashboard__section">
            <div className="dashboard__section-title">
              {t("choose_your_plan")}
            </div>
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
                      <div className="subscription-badge subscription-badge--popular">
                        <Star size={14} />
                        {t("most_popular")}
                      </div>
                    )}

                    {/* Current Plan Badge */}
                    {isCurrent && (
                      <div className="subscription-badge subscription-badge--current">
                        <Check size={14} />
                        {t("current_plan_badge")}
                      </div>
                    )}

                    {/* Card Header */}
                    <div className="subscription-card__header">
                      <div
                        className={`subscription-card__icon subscription-card__icon--${tier.color}`}
                      >
                        <IconComponent size={32} />
                      </div>
                      <h3 className="subscription-card__title">{tier.name}</h3>
                      <p className="subscription-card__description">
                        {tier.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="subscription-card__pricing">
                      <div className="subscription-card__price">
                        <span className="subscription-card__currency">$</span>
                        <span className="subscription-card__amount">
                          {tier.price}
                        </span>
                        <span className="subscription-card__period">
                          /{tier.period}
                        </span>
                      </div>
                      {tier.price > 0 && (
                        <div className="subscription-card__billing">
                          {t("billed_monthly")}
                        </div>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="subscription-card__features">
                      <ul className="subscription-card__features-list">
                        {tier.features.map((feature, index) => (
                          <li
                            key={index}
                            className="subscription-card__feature"
                          >
                            <Check
                              size={16}
                              className="subscription-card__feature-icon"
                            />
                            <span className="subscription-card__feature-text">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="subscription-card__action">
                      <button
                        className={`subscription-card__button subscription-card__button--${getTierButtonVariant(tier)}`}
                        onClick={() => handleUpgrade(tier.name)}
                        disabled={isCurrent || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader
                              size={16}
                              className="subscription-card__loader"
                            />
                            {t("processing")}
                          </>
                        ) : (
                          <>
                            {!isCurrent && <ArrowRight size={16} />}
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
      </div>
    </div>
  );
};

export default SubscriptionPage;
