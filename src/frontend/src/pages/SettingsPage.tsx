import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  User,
  Shield,
  Globe,
  Palette,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Lock,
  Monitor,
  AlertTriangle,
  Edit3,
} from "lucide-react";

interface User {
  username: string;
  loginMethod: "username" | "icp" | "google";
  email?: string;
  principal?: string;
}

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Edit states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");

  // Password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleSaveUsername = async () => {
    try {
      // For now, just update local state since we don't have updateUser
      // In real implementation, you would call your API here
      console.log("Changing username to:", newUsername);
      setIsEditingUsername(false);
    } catch (error) {
      console.error("Failed to update username:", error);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert(t("passwords_dont_match"));
      return;
    }
    try {
      // For now, just log the password change
      // In real implementation, you would call your API here
      console.log("Updating password");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t("delete_account_confirmation"))) {
      try {
        // For now, just log the account deletion
        // In real implementation, you would call your API here
        console.log("Deleting account");
        logout();
        navigate("/");
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__main">
          {/* Header */}
          <div className="dashboard__section">
            <div className="dashboard__header">
              <h1 className="dashboard__title">{t("settings")}</h1>
              <p className="dashboard__subtitle">
                {t("manage_your_account_preferences")}
              </p>
            </div>
          </div>

          <div className="dashboard__section">
            {/* Account Information Section */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <User size={20} style={{ color: "var(--color-accent)" }} />
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      margin: "0",
                      color: "var(--color-text)",
                    }}
                  >
                    {t("account_information")}
                  </h2>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Username Setting */}
                <div
                  style={{
                    padding: "16px",
                    background: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        margin: "0",
                        color: "var(--color-text)",
                      }}
                    >
                      {t("username")}
                    </h3>
                    <button
                      onClick={() => setIsEditingUsername(!isEditingUsername)}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                  {isEditingUsername ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid var(--color-border)",
                          borderRadius: "6px",
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          fontSize: "14px",
                          width: "100%",
                        }}
                        placeholder={t("enter_new_username")}
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={handleSaveUsername}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            background: "var(--color-accent)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          <Save size={16} />
                          {t("save")}
                        </button>
                        <button
                          onClick={() => setIsEditingUsername(false)}
                          style={{
                            padding: "6px 12px",
                            background: "var(--color-surface)",
                            color: "var(--color-text)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {user?.username || "N/A"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Login Method Display */}
                <div
                  style={{
                    padding: "16px",
                    background: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ marginBottom: "12px" }}>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        margin: "0",
                        color: "var(--color-text)",
                      }}
                    >
                      {t("login_method")}
                    </h3>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        padding: "4px 8px",
                        background: "var(--color-surface)",
                        borderRadius: "4px",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {user?.loginMethod === "username" && "Username/Password"}
                      {user?.loginMethod === "icp" && "Internet Identity"}
                      {user?.loginMethod === "google" && "Google OAuth"}
                    </span>
                  </div>
                </div>

                {/* Email Display (if available) */}
                {user?.email && (
                  <div
                    style={{
                      padding: "16px",
                      background: "var(--color-background)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ marginBottom: "8px" }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          margin: "0",
                          color: "var(--color-text)",
                        }}
                      >
                        {t("email")}
                      </h3>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {user.email}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          {user?.loginMethod === "username" && (
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <Shield size={20} style={{ color: "var(--color-accent)" }} />
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      margin: "0",
                      color: "var(--color-text)",
                    }}
                  >
                    {t("security")}
                  </h2>
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "6px",
                }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      margin: "0",
                      color: "var(--color-text)",
                    }}
                  >
                    {t("change_password")}
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "6px",
                        color: "var(--color-text)",
                      }}
                    >
                      {t("current_password")}
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 40px 8px 12px",
                          border: "1px solid var(--color-border)",
                          borderRadius: "6px",
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                        placeholder={t("enter_current_password")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-text-secondary)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "6px",
                        color: "var(--color-text)",
                      }}
                    >
                      {t("new_password")}
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 40px 8px 12px",
                          border: "1px solid var(--color-border)",
                          borderRadius: "6px",
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                        placeholder={t("enter_new_password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-text-secondary)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "6px",
                        color: "var(--color-text)",
                      }}
                    >
                      {t("confirm_password")}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--color-border)",
                        borderRadius: "6px",
                        background: "var(--color-surface)",
                        color: "var(--color-text)",
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                      placeholder={t("confirm_new_password")}
                    />
                  </div>

                  <button
                    onClick={handlePasswordUpdate}
                    disabled={
                      !currentPassword || !newPassword || !confirmPassword
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      background:
                        !currentPassword || !newPassword || !confirmPassword
                          ? "var(--color-text-tertiary)"
                          : "var(--color-accent)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor:
                        !currentPassword || !newPassword || !confirmPassword
                          ? "not-allowed"
                          : "pointer",
                      fontSize: "14px",
                    }}
                  >
                    <Lock size={16} />
                    {t("update_password")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Section */}
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <Palette size={20} style={{ color: "var(--color-accent)" }} />
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: "0",
                    color: "var(--color-text)",
                  }}
                >
                  {t("preferences")}
                </h2>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Theme Setting */}
              <div
                style={{
                  padding: "16px",
                  background: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "6px",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      margin: "0",
                      color: "var(--color-text)",
                    }}
                  >
                    {t("theme")}
                  </h3>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      if (theme !== "light") toggleTheme();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      background:
                        theme === "light"
                          ? "var(--color-accent)"
                          : "var(--color-surface)",
                      color: theme === "light" ? "white" : "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    <Monitor size={16} />
                    <span>{t("light_theme")}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (theme !== "dark") toggleTheme();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      background:
                        theme === "dark"
                          ? "var(--color-accent)"
                          : "var(--color-surface)",
                      color: theme === "dark" ? "white" : "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    <Monitor size={16} />
                    <span>{t("dark_theme")}</span>
                  </button>
                </div>
              </div>

              {/* Language Setting */}
              <div
                style={{
                  padding: "16px",
                  background: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "6px",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      margin: "0",
                      color: "var(--color-text)",
                    }}
                  >
                    {t("language")}
                  </h3>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      background:
                        i18n.language === "en"
                          ? "var(--color-accent)"
                          : "var(--color-surface)",
                      color:
                        i18n.language === "en" ? "white" : "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    <Globe size={16} />
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => handleLanguageChange("id")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      background:
                        i18n.language === "id"
                          ? "var(--color-accent)"
                          : "var(--color-surface)",
                      color:
                        i18n.language === "id" ? "white" : "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    <Globe size={16} />
                    <span>Bahasa Indonesia</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid #dc2626",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <AlertTriangle size={20} style={{ color: "#dc2626" }} />
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: "0",
                    color: "#dc2626",
                  }}
                >
                  {t("danger_zone")}
                </h2>
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                background: "var(--color-background)",
                border: "1px solid #dc2626",
                borderRadius: "6px",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    margin: "0 0 4px 0",
                    color: "var(--color-text)",
                  }}
                >
                  {t("delete_account")}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    margin: "0",
                  }}
                >
                  {t("delete_account_warning")}
                </p>
              </div>
              <div>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <Trash2 size={16} />
                  {t("delete_account")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
