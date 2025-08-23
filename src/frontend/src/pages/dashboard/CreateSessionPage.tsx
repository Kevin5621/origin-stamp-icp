// src/frontend/src/pages/dashboard/CreateSessionPage.tsx
import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Camera,
  Palette,
  Loader,
  Crown,
  AlertTriangle,
  Info,
} from "lucide-react";
import PhysicalArtService from "../../services/physicalArtService";
import { useToastContext } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
// Dynamic import for backend to avoid TypeScript module resolution issues

/**
 * Create Session Page - Halaman untuk membuat sesi baru
 */
const CreateSessionPage: React.FC = () => {
  const { t } = useTranslation("session");
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const { user, isAuthenticated } = useAuth();
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [artType, setArtType] = useState<"physical" | "digital">("physical");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCreating, setIsCreating] = useState(false);

  // Subscription state
  const [subscriptionTier, setSubscriptionTier] = useState<string>("Free");
  const [subscriptionLimits, setSubscriptionLimits] = useState<any>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  // Load user subscription data on component mount
  useEffect(() => {
    const loadSubscriptionData = async () => {
      if (!user?.username) return;

      try {
        setIsLoadingSubscription(true);

        // TODO: Replace with real backend call when module resolution is fixed
        // For now, use mock data based on username
        if (user.username === "admin_user") {
          setSubscriptionTier("Enterprise");
          setSubscriptionLimits({
            max_photos: 100,
            max_file_size_mb: 50,
            can_generate_nft: true,
            priority_support: true,
          });
        } else if (user.username === "test_user") {
          setSubscriptionTier("Basic");
          setSubscriptionLimits({
            max_photos: 20,
            max_file_size_mb: 25,
            can_generate_nft: true,
            priority_support: false,
          });
        } else {
          setSubscriptionTier("Free");
          setSubscriptionLimits({
            max_photos: 5,
            max_file_size_mb: 10,
            can_generate_nft: false,
            priority_support: false,
          });
        }
      } catch (error) {
        console.error("Failed to load subscription data:", error);
        // Set default values
        setSubscriptionTier("Free");
        setSubscriptionLimits({
          max_photos: 5,
          max_file_size_mb: 10,
          can_generate_nft: false,
          priority_support: false,
        });
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    loadSubscriptionData();
  }, [user?.username]);

  const handleCreateSession = useCallback(async () => {
    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!sessionTitle.trim()) {
      newErrors.title = t("session_title_required");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsCreating(true);

    try {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        addToast("error", t("please_login_first"));
        navigate("/login");
        return;
      }

      // Get username from auth context
      const username = user.username;

      // Create session using PhysicalArtService
      const sessionId = await PhysicalArtService.createSession(
        username,
        sessionTitle,
        sessionDescription,
      );

      addToast("success", t("session_created_successfully"));

      // Navigate to session recording page
      navigate(`/sessions/${sessionId}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("session_creation_failed");
      addToast("error", errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [sessionTitle, sessionDescription, t, navigate, addToast]);

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__main">
          {/* Header Section */}
          <div className="dashboard__section">
            <div className="dashboard__header">
              <button className="btn-back" onClick={() => navigate("/session")}>
                <ArrowLeft size={20} />
                {t("back_to_sessions")}
              </button>
              <h1 className="dashboard__title">
                {t("create_new_session_title")}
              </h1>
              <p className="dashboard__subtitle">
                {t("create_new_session_description")}
              </p>
            </div>
          </div>

          {/* Subscription Status Card */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <div className="subscription-header">
                  <div className="subscription-tier">
                    <Crown size={20} className="subscription-icon" />
                    <span className="subscription-title">
                      {t("subscription_status")}: {subscriptionTier}
                    </span>
                  </div>
                  {subscriptionTier !== "Free" && (
                    <span className="subscription-badge subscription-badge--premium">
                      {t("premium")}
                    </span>
                  )}
                </div>
              </div>
              <div className="dashboard-card__content">
                {isLoadingSubscription ? (
                  <div className="subscription-loading">
                    <Loader size={16} className="animate-spin" />
                    <span>{t("loading_subscription")}</span>
                  </div>
                ) : subscriptionLimits ? (
                  <div className="subscription-limits">
                    <div className="limit-item">
                      <Info size={16} />
                      <span className="limit-label">{t("max_photos")}:</span>
                      <span className="limit-value">
                        {subscriptionLimits.max_photos}
                      </span>
                    </div>
                    <div className="limit-item">
                      <Info size={16} />
                      <span className="limit-label">{t("max_file_size")}:</span>
                      <span className="limit-value">
                        {subscriptionLimits.max_file_size_mb}MB
                      </span>
                    </div>
                    <div className="limit-item">
                      <Info size={16} />
                      <span className="limit-label">
                        {t("nft_generation")}:
                      </span>
                      <span
                        className={`limit-value limit-value--${subscriptionLimits.can_generate_nft ? "enabled" : "disabled"}`}
                      >
                        {subscriptionLimits.can_generate_nft
                          ? t("enabled")
                          : t("disabled")}
                      </span>
                    </div>
                    {subscriptionLimits.priority_support && (
                      <div className="limit-item">
                        <Crown size={16} />
                        <span className="limit-label">
                          {t("priority_support")}:
                        </span>
                        <span className="limit-value limit-value--enabled">
                          {t("enabled")}
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Upgrade Prompt for Free Users */}
                {subscriptionTier === "Free" && (
                  <div className="upgrade-prompt">
                    <AlertTriangle size={16} className="upgrade-icon" />
                    <div className="upgrade-content">
                      <h4>{t("upgrade_recommended")}</h4>
                      <p>{t("upgrade_description")}</p>
                      <button
                        className="btn btn--upgrade"
                        onClick={() => navigate("/subscription")}
                      >
                        <Crown size={16} />
                        {t("upgrade_now")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Session Creation Form */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">
                  {t("session_details")}
                </h2>
              </div>
              <div className="dashboard-card__content">
                <div className="create-session__form">
                  {/* Art Type Selection */}
                  <div className="form-group">
                    <label className="form-label">{t("art_type_label")}</label>
                    <div className="art-type-selector">
                      <button
                        type="button"
                        className={`art-type-option ${artType === "physical" ? "art-type-option--active" : ""}`}
                        onClick={() => setArtType("physical")}
                      >
                        <div className="art-type-icon">
                          <Camera size={24} />
                        </div>
                        <div className="art-type-content">
                          <h4>{t("physical_art_option_title")}</h4>
                          <p>{t("physical_art_option_description")}</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`art-type-option ${artType === "digital" ? "art-type-option--active" : ""}`}
                        onClick={() => setArtType("digital")}
                      >
                        <div className="art-type-icon">
                          <Palette size={24} />
                        </div>
                        <div className="art-type-content">
                          <h4>{t("digital_art_option_title")}</h4>
                          <p>{t("digital_art_option_description")}</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Session Title */}
                  <div className="form-group">
                    <label htmlFor="session-title" className="form-label">
                      {t("session_title")}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="session-title"
                      type="text"
                      value={sessionTitle}
                      onChange={(e) => {
                        setSessionTitle(e.target.value);
                        if (errors.title) {
                          setErrors((prev) => ({ ...prev, title: "" }));
                        }
                      }}
                      placeholder={t("enter_session_title")}
                      className={`form-input ${errors.title ? "form-input--error" : ""}`}
                    />
                    {errors.title && (
                      <div className="error-message">{errors.title}</div>
                    )}
                  </div>

                  {/* Session Description */}
                  <div className="form-group">
                    <label htmlFor="session-description" className="form-label">
                      {t("description")} ({t("optional")})
                    </label>
                    <textarea
                      id="session-description"
                      value={sessionDescription}
                      onChange={(e) => setSessionDescription(e.target.value)}
                      placeholder={t("describe_session_placeholder")}
                      className="form-textarea"
                      rows={4}
                    />
                  </div>

                  {/* Subscription Warning for Free Users */}
                  {subscriptionTier === "Free" && (
                    <div className="subscription-warning">
                      <AlertTriangle size={16} className="warning-icon" />
                      <div className="warning-content">
                        <p className="warning-text">
                          <strong>{t("free_tier_limitation")}:</strong>{" "}
                          {t("free_tier_photo_limit", {
                            count: subscriptionLimits?.max_photos || 5,
                          })}
                        </p>
                        <p className="warning-text">
                          {t("free_tier_nft_disabled")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button
                      className="btn btn--secondary"
                      onClick={() => navigate("/session")}
                      disabled={isCreating}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      className="btn btn--primary"
                      onClick={handleCreateSession}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          {t("creating_session")}
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          {t("create_session_button")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionPage;
