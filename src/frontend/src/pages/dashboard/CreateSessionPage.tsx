// src/frontend/src/pages/dashboard/CreateSessionPage.tsx
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Loader,
  Crown,
  AlertTriangle,
  Info,
  Download,
} from "lucide-react";
import PhysicalArtService from "../../services/physicalArtService";
import { useToastContext } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import { useSubscription } from "../../contexts/SubscriptionContext";

// Custom SVG Icons as inline components
const CameraIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M28 24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V12C4 10.8954 4.89543 10 6 10H8L10 7H22L24 10H26C27.1046 10 28 10.8954 28 12V24Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle
      cx="16"
      cy="18"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="16" cy="18" r="2" fill="currentColor" />
  </svg>
);

const DigitalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect
      x="4"
      y="6"
      width="24"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M8 26H24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14 22V26"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 22V26"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="14" r="2" fill="currentColor" />
    <circle cx="20" cy="14" r="2" fill="currentColor" />
    <circle cx="16" cy="10" r="1" fill="currentColor" />
  </svg>
);

// Plugin Icons
const PhotoshopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#31A8FF" />
    <path
      d="M6 7H12C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17H9V19H6V7ZM9 10V14H12C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10H9Z"
      fill="white"
    />
  </svg>
);

const IllustratorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#FF9A00" />
    <path
      d="M7 7H10L13 17H10L9.5 15H7.5L7 17H4L7 7ZM8.5 10L8 13H9L8.5 10Z"
      fill="white"
    />
    <path d="M15 7H17V17H15V7Z" fill="white" />
  </svg>
);

const PremiereIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#9999FF" />
    <path
      d="M6 7H12C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17H9V19H6V7ZM9 10V14H12C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10H9Z"
      fill="white"
    />
    <path d="M15 12H18V15H15V12Z" fill="white" />
  </svg>
);

const AfterEffectsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#9999FF" />
    <path
      d="M7 7H10L13 17H10L9.5 15H7.5L7 17H4L7 7ZM8.5 10L8 13H9L8.5 10Z"
      fill="white"
    />
    <path d="M15 7H18V10H15V7ZM15 12H18V17H15V12Z" fill="white" />
  </svg>
);

const BlenderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#F5792A" />
    <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="2" fill="white" />
    <path d="M12 7V5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 19V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MayaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#0696D7" />
    <path d="M6 7H9V17H6V12L8 15L10 12V17H13V7H10L8 10L6 7Z" fill="white" />
    <path d="M15 7H18L20 17H17L16.5 15H15.5L15 17H12L15 7Z" fill="white" />
  </svg>
);

const AbletonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#FF764D" />
    <rect x="6" y="10" width="2" height="8" fill="white" />
    <rect x="10" y="8" width="2" height="10" fill="white" />
    <rect x="14" y="6" width="2" height="12" fill="white" />
    <rect x="18" y="9" width="2" height="9" fill="white" />
  </svg>
);

const FLStudioIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#F57C00" />
    <path d="M6 7H12V10H9V17H6V7Z" fill="white" />
    <path d="M15 7H18V17H15V12H17V10H15V7Z" fill="white" />
  </svg>
);

const VSCodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#007ACC" />
    <path
      d="M17 4L12 8L7 5L4 7V17L7 19L12 16L17 20L20 18V6L17 4Z"
      fill="white"
    />
  </svg>
);

const UnityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#000000" />
    <path
      d="M12 4L16 8H8L12 4ZM12 20L8 16H16L12 20ZM4 12L8 8V16L4 12ZM20 12L16 16V8L20 12Z"
      fill="white"
    />
  </svg>
);

/**
 * Create Session Page - Enhanced UI/UX with external CSS styling
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

  // Subscription state from context
  const { currentTier, subscriptionLimits } = useSubscription();

  // Digital Art Plugin Categories
  const pluginCategories = [
    {
      key: "image_editing",
      plugins: [
        {
          key: "photoshop",
          icon: <PhotoshopIcon />,
          nameKey: "photoshop_plugin",
          descKey: "photoshop_description",
        },
        {
          key: "illustrator",
          icon: <IllustratorIcon />,
          nameKey: "illustrator_plugin",
          descKey: "illustrator_description",
        },
      ],
    },
    {
      key: "video_editing",
      plugins: [
        {
          key: "premiere",
          icon: <PremiereIcon />,
          nameKey: "premiere_plugin",
          descKey: "premiere_description",
        },
        {
          key: "aftereffects",
          icon: <AfterEffectsIcon />,
          nameKey: "aftereffects_plugin",
          descKey: "aftereffects_description",
        },
      ],
    },
    {
      key: "3d_modeling",
      plugins: [
        {
          key: "blender",
          icon: <BlenderIcon />,
          nameKey: "blender_plugin",
          descKey: "blender_description",
        },
        {
          key: "maya",
          icon: <MayaIcon />,
          nameKey: "maya_plugin",
          descKey: "maya_description",
        },
      ],
    },
    {
      key: "music_production",
      plugins: [
        {
          key: "ableton",
          icon: <AbletonIcon />,
          nameKey: "ableton_plugin",
          descKey: "ableton_description",
        },
        {
          key: "fl_studio",
          icon: <FLStudioIcon />,
          nameKey: "fl_studio_plugin",
          descKey: "fl_studio_description",
        },
      ],
    },
    {
      key: "code_development",
      plugins: [
        {
          key: "vscode",
          icon: <VSCodeIcon />,
          nameKey: "vscode_extension",
          descKey: "vscode_description",
        },
        {
          key: "unity",
          icon: <UnityIcon />,
          nameKey: "unity_plugin",
          descKey: "unity_description",
        },
      ],
    },
  ];

  const handlePluginClick = (pluginKey: string) => {
    console.log("Plugin selected:", pluginKey);
    addToast("info", t("coming_soon"));
  };

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
      if (!isAuthenticated || !user) {
        addToast("error", t("please_login_first"));
        navigate("/login");
        return;
      }

      const username = user.username;
      const sessionId = await PhysicalArtService.createSession(
        username,
        sessionTitle,
        sessionDescription,
      );

      addToast("success", t("session_created_successfully"));
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
    <div className="create-session">
      <div className="create-session__content">
        <div className="create-session__main">
          {/* Header */}
          <div className="create-session__header">
            <button onClick={() => navigate("/session")} className="btn-back">
              <ArrowLeft size={20} />
              {t("back_to_sessions")}
            </button>
            <h1 className="create-session__title">
              {t("create_new_session_title")}
            </h1>
            <p className="create-session__description">
              {t("create_new_session_description")}
            </p>
          </div>

          {/* Subscription Status */}
          <div className="create-session__section">
            <div className="subscription-card">
              <div className="subscription-card__header">
                <div className="subscription-card__title">
                  <Crown size={24} className="subscription-card__icon" />
                  <span>
                    {t("subscription_status")}: {currentTier}
                  </span>
                </div>
                {currentTier !== "Free" && (
                  <span className="subscription-card__badge">
                    {t("premium")}
                  </span>
                )}
              </div>

              {subscriptionLimits ? (
                <div className="subscription-card__limits">
                  <div className="subscription-card__limit-item">
                    <Info size={16} />
                    <span className="subscription-card__limit-label">
                      {t("max_photos")}:
                    </span>
                    <span className="subscription-card__limit-value">
                      {subscriptionLimits.max_photos}
                    </span>
                  </div>
                  <div className="subscription-card__limit-item">
                    <Info size={16} />
                    <span className="subscription-card__limit-label">
                      {t("max_file_size")}:
                    </span>
                    <span className="subscription-card__limit-value">
                      {subscriptionLimits.max_file_size_mb}MB
                    </span>
                  </div>
                  <div className="subscription-card__limit-item">
                    <Info size={16} />
                    <span className="subscription-card__limit-label">
                      {t("nft_generation")}:
                    </span>
                    <span
                      className={`subscription-card__limit-value ${
                        subscriptionLimits.can_generate_nft
                          ? "subscription-card__limit-value--enabled"
                          : "subscription-card__limit-value--disabled"
                      }`}
                    >
                      {subscriptionLimits.can_generate_nft
                        ? t("enabled")
                        : t("disabled")}
                    </span>
                  </div>
                  {subscriptionLimits.priority_support && (
                    <div className="subscription-card__limit-item">
                      <Crown size={16} className="subscription-card__icon" />
                      <span className="subscription-card__limit-label">
                        {t("priority_support")}:
                      </span>
                      <span className="subscription-card__limit-value subscription-card__limit-value--enabled">
                        {t("enabled")}
                      </span>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Upgrade Prompt for Free Users */}
              {currentTier === "Free" && (
                <div className="upgrade-prompt">
                  <AlertTriangle size={16} className="upgrade-icon" />
                  <div className="upgrade-content">
                    <h4>{t("upgrade_recommended")}</h4>
                    <p>{t("upgrade_description")}</p>
                    <button
                      onClick={() => navigate("/subscription")}
                      className="btn-upgrade"
                    >
                      <Crown size={16} />
                      {t("upgrade_now")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Session Creation Form */}
          <div className="create-session__section">
            <div className="create-session__form">
              <h2 className="create-session__section-title">
                {t("session_details")}
              </h2>

              <div>
                {/* Art Type Selection */}
                <div className="form-group">
                  <label className="form-label">{t("art_type_label")}</label>
                  <div className="art-type-selector">
                    {/* Physical Art Option */}
                    <button
                      type="button"
                      onClick={() => setArtType("physical")}
                      className={`art-type-option ${
                        artType === "physical" ? "art-type-option--active" : ""
                      }`}
                    >
                      <div className="art-type-icon">
                        <CameraIcon />
                      </div>
                      <div className="art-type-content">
                        <h4>{t("physical_art_option_title")}</h4>
                        <p>{t("physical_art_option_description")}</p>
                      </div>
                    </button>

                    {/* Digital Art Option */}
                    <button
                      type="button"
                      onClick={() => setArtType("digital")}
                      className={`art-type-option ${
                        artType === "digital" ? "art-type-option--active" : ""
                      }`}
                    >
                      <div className="art-type-icon">
                        <DigitalIcon />
                      </div>
                      <div className="art-type-content">
                        <h4>{t("digital_art_option_title")}</h4>
                        <p>{t("digital_art_option_description")}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Digital Art Plugins (show only when digital is selected) */}
                {artType === "digital" && (
                  <div className="form-group">
                    <h3 className="create-session__section-title">
                      {t("digital_art_plugins")}
                    </h3>
                    <p className="form-label">
                      {t("digital_art_plugin_description")}
                    </p>

                    {pluginCategories.map((category) => (
                      <div key={category.key} style={{ marginBottom: "20px" }}>
                        <h4 className="create-session__section-title">
                          {t(category.key)}
                        </h4>
                        <div className="plugin-categories">
                          {category.plugins.map((plugin) => (
                            <button
                              key={plugin.key}
                              onClick={() => handlePluginClick(plugin.key)}
                              className="plugin-item"
                            >
                              <div className="plugin-item__icon">
                                {plugin.icon}
                              </div>
                              <div className="plugin-item__content">
                                <div className="plugin-item__name">
                                  {t(plugin.nameKey)}
                                </div>
                                <div className="plugin-item__description">
                                  {t(plugin.descKey)}
                                </div>
                              </div>
                              <Download
                                size={16}
                                className="plugin-item__icon"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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
                    rows={4}
                    className="form-textarea"
                  />
                </div>

                {/* Free Tier Warning */}
                {currentTier === "Free" && (
                  <div className="warning-banner">
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
                    onClick={() => navigate("/session")}
                    disabled={isCreating}
                    className="btn btn--secondary"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleCreateSession}
                    disabled={isCreating}
                    className="btn btn--primary"
                  >
                    {isCreating ? (
                      <>
                        <Loader size={16} />
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
  );
};

export default CreateSessionPage;
