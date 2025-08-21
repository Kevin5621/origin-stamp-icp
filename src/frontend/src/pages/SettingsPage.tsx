import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
} from "lucide-react";

interface User {
  username: string;
  loginMethod: "username" | "icp" | "google";
  email?: string;
  principal?: string;
}

const SettingsPage: React.FC = () => {
  const { t } = useTranslation("settings");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [language, setLanguage] = useState("id");

  const handleSavePassword = () => {
    // Implement password change logic
    console.log("Changing password...");
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    if (confirm(tCommon("confirm_delete_account"))) {
      console.log("Deleting account...");
      logout();
      navigate("/");
    }
  };

  const getLoginMethodInfo = (method: string) => {
    switch (method) {
      case "username":
        return {
          icon: <User size={20} strokeWidth={2} />,
          title: t("username_password_login"),
          description: t("username_password_description"),
          color: "var(--color-info)",
        };
      case "icp":
        return {
          icon: <Shield size={20} strokeWidth={2} />,
          title: t("icp_identity_login"),
          description: t("icp_identity_description"),
          color: "var(--color-success)",
        };
      case "google":
        return {
          icon: <Globe size={20} strokeWidth={2} />,
          title: t("google_login"),
          description: t("google_login_description"),
          color: "var(--color-warning)",
        };
      default:
        return {
          icon: <User size={20} strokeWidth={2} />,
          title: t("unknown_login"),
          description: t("unknown_login_description"),
          color: "var(--color-text-secondary)",
        };
    }
  };

  const loginInfo = getLoginMethodInfo(user?.loginMethod || "username");

  return (
    <div className="dashboard">
      {/* Settings Page Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-left">
          <div className="dashboard__header-info">
            <h1 className="dashboard__title">{t("settings")}</h1>
            <p className="dashboard__subtitle">
              {t("manage_account_preferences")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Bento Layout */}
      <div className="dashboard__main-content">
        <div className="settings-bento-grid">
          {/* Account Information - Large Card */}
          <div className="settings-bento-card settings-bento-card--large">
            <div className="bento-card-header">
              <div className="bento-card-icon">
                <User size={16} strokeWidth={2} />
              </div>
              <h3 className="bento-card-title">{t("account_information")}</h3>
            </div>

            <div className="bento-card-content">
              <div className="login-method-info">
                <div
                  className="login-method-icon"
                  style={{ color: loginInfo.color }}
                >
                  {loginInfo.icon}
                </div>
                <div className="login-method-details">
                  <h4 className="login-method-title">{loginInfo.title}</h4>
                  <p className="login-method-description">
                    {loginInfo.description}
                  </p>
                </div>
              </div>

              <div className="account-details">
                <div className="account-detail">
                  <span className="account-label">{t("username")}:</span>
                  <span className="account-value">
                    {user?.username || "N/A"}
                  </span>
                </div>

                {user?.email && (
                  <div className="account-detail">
                    <span className="account-label">{t("email")}:</span>
                    <span className="account-value">{user.email}</span>
                  </div>
                )}

                {user?.principal && (
                  <div className="account-detail">
                    <span className="account-label">{t("icp_principal")}:</span>
                    <span
                      className="account-value account-value--truncated"
                      title={user.principal}
                    >
                      {user.principal.length > 25
                        ? `${user.principal.slice(0, 12)}...${user.principal.slice(-8)}`
                        : user.principal}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Settings - Medium Card */}
          {user?.loginMethod === "username" && (
            <div className="settings-bento-card settings-bento-card--medium">
              <div className="bento-card-header">
                <div className="bento-card-icon">
                  <Lock size={16} strokeWidth={2} />
                </div>
                <h3 className="bento-card-title">{t("security_settings")}</h3>
              </div>

              <div className="bento-card-content">
                <div className="password-form">
                  <div className="form-group">
                    <label className="form-label">
                      {t("current_password")}
                    </label>
                    <div className="password-input-group">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="form-input"
                        placeholder={t("enter_current_password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="password-toggle-btn"
                      >
                        {showPasswords ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("new_password")}</label>
                    <div className="password-input-group">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-input"
                        placeholder={t("enter_new_password")}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {t("confirm_new_password")}
                    </label>
                    <div className="password-input-group">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input"
                        placeholder={t("confirm_new_password")}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSavePassword}
                    className="settings-save-btn"
                    disabled={
                      !currentPassword ||
                      !newPassword ||
                      newPassword !== confirmPassword
                    }
                  >
                    <Save size={16} strokeWidth={2} />
                    <span>{t("save_password")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings - Small Card */}
          <div className="settings-bento-card settings-bento-card--small">
            <div className="bento-card-header">
              <div className="bento-card-icon">
                <Monitor size={16} strokeWidth={2} />
              </div>
              <h3 className="bento-card-title">{t("appearance_settings")}</h3>
            </div>

            <div className="bento-card-content">
              <div className="appearance-options">
                <div className="appearance-option">
                  <div className="appearance-info">
                    <Palette size={20} strokeWidth={2} />
                    <div>
                      <h4 className="appearance-title">{t("theme")}</h4>
                      <p className="appearance-description">
                        {t("theme_description")}
                      </p>
                    </div>
                  </div>
                  <select
                    value={theme}
                    onChange={(e) =>
                      setTheme(e.target.value as "light" | "dark" | "auto")
                    }
                    className="theme-select"
                  >
                    <option value="light">{t("light_theme")}</option>
                    <option value="dark">{t("dark_theme")}</option>
                    <option value="auto">{t("auto_theme")}</option>
                  </select>
                </div>

                <div className="appearance-option">
                  <div className="appearance-info">
                    <Globe size={20} strokeWidth={2} />
                    <div>
                      <h4 className="appearance-title">{t("language")}</h4>
                      <p className="appearance-description">
                        {t("language_description")}
                      </p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="language-select"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone - Small Card */}
          <div className="settings-bento-card settings-bento-card--small settings-bento-card--danger">
            <div className="bento-card-header">
              <div className="bento-card-icon">
                <AlertTriangle size={16} strokeWidth={2} />
              </div>
              <h3 className="bento-card-title">{t("danger_zone")}</h3>
            </div>

            <div className="bento-card-content">
              <div className="danger-info">
                <Trash2 size={20} strokeWidth={2} />
                <div>
                  <h4 className="danger-title">{t("delete_account")}</h4>
                  <p className="danger-description">
                    {t("delete_account_description")}
                  </p>
                </div>
              </div>
              <button onClick={handleDeleteAccount} className="danger-btn">
                <Trash2 size={16} strokeWidth={2} />
                <span>{t("delete_account")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
