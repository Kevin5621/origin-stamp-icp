import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  User,
  Shield,
  Key,
  Globe,
  Bell,
  Palette,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Trash2,
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
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    projectUpdates: true,
    securityAlerts: true,
  });
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [language, setLanguage] = useState("id");

  const handleBack = () => {
    navigate(-1);
  };

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
      {/* Header with Dashboard Consistency */}
      <div className="dashboard__bento-header">
        <div className="dashboard__welcome-card">
          <div className="welcome-card__content">
            <div className="settings-header-left">
              <button onClick={handleBack} className="settings-back-btn">
                <ArrowLeft size={20} strokeWidth={2} />
                <span>{t("back")}</span>
              </button>
            </div>
            <h1 className="welcome-card__title">{t("settings")}</h1>
            <p className="welcome-card__subtitle">
              {t("settings_description") ||
                "Manage your account and preferences"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Dashboard Layout */}
      <div className="dashboard__main-content">
        <div className="settings-container">
          {/* Account Information */}
          <div className="settings-section">
            <div className="section-header">
              <h3 className="section-title">{t("account_information")}</h3>
            </div>

            <div className="settings-card wireframe-card">
              <div className="login-method-info">
                <div
                  className="login-method-icon"
                  style={{ color: loginInfo.color }}
                >
                  {loginInfo.icon}
                </div>
                <div className="login-method-details">
                  <h3 className="login-method-title">{loginInfo.title}</h3>
                  <p className="login-method-description">
                    {loginInfo.description}
                  </p>
                </div>
              </div>

              <div className="account-details">
                <div className="account-detail">
                  <span className="account-label">{t("username")}:</span>
                  <span className="account-value">{user?.username}</span>
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
                    <span className="account-value">{user.principal}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          {user?.loginMethod === "username" && (
            <div className="settings-section">
              <div className="section-header">
                <h3 className="section-title">{t("security_settings")}</h3>
              </div>

              <div className="settings-card wireframe-card">
                <h3 className="settings-card-title">{t("change_password")}</h3>

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

          {/* Notification Settings */}
          <div className="settings-section">
            <div className="section-header">
              <h3 className="section-title">{t("notification_settings")}</h3>
            </div>

            <div className="settings-card wireframe-card">
              <div className="notification-option">
                <div className="notification-info">
                  <Bell size={20} strokeWidth={2} />
                  <div>
                    <h4 className="notification-title">
                      {t("email_notifications")}
                    </h4>
                    <p className="notification-description">
                      {t("email_notifications_description")}
                    </p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        email: e.target.checked,
                      })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notification-option">
                <div className="notification-info">
                  <Smartphone size={20} strokeWidth={2} />
                  <div>
                    <h4 className="notification-title">
                      {t("push_notifications")}
                    </h4>
                    <p className="notification-description">
                      {t("push_notifications_description")}
                    </p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        push: e.target.checked,
                      })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notification-option">
                <div className="notification-info">
                  <Key size={20} strokeWidth={2} />
                  <div>
                    <h4 className="notification-title">
                      {t("project_updates")}
                    </h4>
                    <p className="notification-description">
                      {t("project_updates_description")}
                    </p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.projectUpdates}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        projectUpdates: e.target.checked,
                      })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notification-option">
                <div className="notification-info">
                  <Shield size={20} strokeWidth={2} />
                  <div>
                    <h4 className="notification-title">
                      {t("security_alerts")}
                    </h4>
                    <p className="notification-description">
                      {t("security_alerts_description")}
                    </p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.securityAlerts}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        securityAlerts: e.target.checked,
                      })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="settings-section">
            <div className="section-header">
              <h3 className="section-title">{t("appearance_settings")}</h3>
            </div>

            <div className="settings-card wireframe-card">
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

          {/* Danger Zone */}
          <div className="settings-section">
            <div className="section-header">
              <h3 className="section-title">{t("danger_zone")}</h3>
            </div>

            <div className="settings-card wireframe-card danger-card">
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
