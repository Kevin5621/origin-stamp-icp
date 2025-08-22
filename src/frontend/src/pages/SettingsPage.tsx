import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToastContext } from "../contexts/ToastContext";
import { backendService } from "../services/backendService";
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
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success, error, warning, info } = useToastContext();

  // Edit states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [usernamePassword, setUsernamePassword] = useState("");
  const [showUsernamePassword, setShowUsernamePassword] = useState(false);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

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
    if (!user?.username || !newUsername.trim() || !usernamePassword.trim()) {
      error(t("username_cannot_be_empty"));
      return;
    }

    if (newUsername.trim() === user.username) {
      warning(t("new_username_same_as_old"));
      return;
    }

    setIsUpdatingUsername(true);
    try {
      const result = await backendService.updateUsername(
        user.username,
        newUsername.trim(),
        usernamePassword,
      );

      if (result.success) {
        success(t("username_change_success"));
        // Update local user state
        const updatedUser = { ...user, username: newUsername.trim() };
        updateUser(updatedUser);
        setIsEditingUsername(false);
        setNewUsername(updatedUser.username);
        setUsernamePassword("");
      } else {
        error(result.message || t("username_change_failed"));
      }
    } catch (err) {
      console.error("Failed to update username:", err);
      error(t("username_change_failed"));
    } finally {
      setIsUpdatingUsername(false);
      setIsEditingUsername(false);
      setNewUsername(user?.username || "");
      setUsernamePassword("");
    }
  };

  const handleCancelUsernameEdit = () => {
    setIsEditingUsername(false);
    setNewUsername(user?.username || "");
    setUsernamePassword("");
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      warning(t("passwords_dont_match"));
      return;
    }
    try {
      // For now, just log the password change
      // In real implementation, you would call your API here
      console.log("Updating password");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      success(t("password_updated_successfully"));
    } catch (err) {
      console.error("Failed to update password:", err);
      error(t("password_update_failed"));
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t("confirm_delete_account"))) {
      try {
        // For now, just log the account deletion
        // In real implementation, you would call your API here
        console.log("Deleting account");
        logout();
        navigate("/");
        info(t("account_deleted_successfully"));
      } catch (err) {
        console.error("Failed to delete account:", err);
        error(t("account_deletion_failed"));
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
                {t("manage_account_preferences")}
              </p>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="dashboard__section">
            <div className="settings-page__section">
              <div className="settings-page__section-header">
                <User className="settings-page__section-icon" />
                <h2 className="settings-page__section-title">
                  {t("account_information")}
                </h2>
              </div>

              <div className="settings-page__field">
                <div className="settings-page__field-header">
                  <h3 className="settings-page__field-title">
                    {t("username")}
                  </h3>
                  {user?.loginMethod === "username" && (
                    <button
                      onClick={() => setIsEditingUsername(!isEditingUsername)}
                      className="settings-page__edit-button"
                      aria-label={t("edit_username")}
                    >
                      <Edit3 size={18} />
                    </button>
                  )}
                </div>

                {isEditingUsername ? (
                  <div className="settings-page__input-group">
                    <div className="settings-page__input-group">
                      <label className="settings-page__label">
                        {t("new_username")}
                      </label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="settings-page__input"
                        placeholder={t("enter_new_username")}
                      />
                    </div>
                    <div className="settings-page__input-group">
                      <label className="settings-page__label">
                        {t("current_password")}
                      </label>
                      <div className="settings-page__input-wrapper">
                        <input
                          type={showUsernamePassword ? "text" : "password"}
                          value={usernamePassword}
                          onChange={(e) => setUsernamePassword(e.target.value)}
                          className="settings-page__input"
                          placeholder={t("enter_current_password")}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowUsernamePassword(!showUsernamePassword)
                          }
                          className="settings-page__password-toggle"
                        >
                          {showUsernamePassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="settings-page__button-group">
                      <button
                        onClick={handleSaveUsername}
                        disabled={
                          isUpdatingUsername ||
                          !newUsername.trim() ||
                          !usernamePassword.trim()
                        }
                        className="settings-page__button settings-page__button--primary"
                      >
                        <Save size={16} />
                        {isUpdatingUsername ? t("saving") : t("save_username")}
                      </button>
                      <button
                        onClick={handleCancelUsernameEdit}
                        disabled={isUpdatingUsername}
                        className="settings-page__button settings-page__button--secondary"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="settings-page__field-value">
                    {user?.username || "N/A"}
                  </div>
                )}
              </div>

              {/* Login Method Display */}
              <div className="settings-page__field">
                <div className="settings-page__field-header">
                  <h3 className="settings-page__field-title">
                    {t("login_method")}
                  </h3>
                </div>
                <div className="settings-page__field-value">
                  <span className="settings-page__badge">
                    {user?.loginMethod === "username" && "Username/Password"}
                    {user?.loginMethod === "icp" && "Internet Identity"}
                    {user?.loginMethod === "google" && "Google OAuth"}
                  </span>
                </div>
              </div>

              {/* Email Display (if available) */}
              {user?.email && (
                <div className="settings-page__field">
                  <div className="settings-page__field-header">
                    <h3 className="settings-page__field-title">{t("email")}</h3>
                  </div>
                  <div className="settings-page__field-value">{user.email}</div>
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          {user?.loginMethod === "username" && (
            <div className="dashboard__section">
              <div className="settings-page__section">
                <div className="settings-page__section-header">
                  <Shield className="settings-page__section-icon" />
                  <h2 className="settings-page__section-title">
                    {t("security")}
                  </h2>
                </div>

                <div className="settings-page__field">
                  <div className="settings-page__field-header">
                    <h3 className="settings-page__field-title">
                      {t("change_password")}
                    </h3>
                  </div>

                  <div className="settings-page__input-group">
                    <label className="settings-page__label">
                      {t("current_password")}
                    </label>
                    <div className="settings-page__input-wrapper">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="settings-page__input"
                        placeholder={t("enter_current_password")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="settings-page__password-toggle"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="settings-page__input-group">
                    <label className="settings-page__label">
                      {t("new_password")}
                    </label>
                    <div className="settings-page__input-wrapper">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="settings-page__input"
                        placeholder={t("enter_new_password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="settings-page__password-toggle"
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="settings-page__input-group">
                    <label className="settings-page__label">
                      {t("confirm_new_password")}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="settings-page__input"
                      placeholder={t("confirm_new_password_placeholder")}
                    />
                  </div>

                  <div className="settings-page__button-group">
                    <button
                      onClick={handlePasswordUpdate}
                      disabled={
                        !currentPassword || !newPassword || !confirmPassword
                      }
                      className="settings-page__button settings-page__button--primary"
                    >
                      <Lock size={16} />
                      {t("update_password")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Section */}
          <div className="dashboard__section">
            <div className="settings-page__section">
              <div className="settings-page__section-header">
                <Palette className="settings-page__section-icon" />
                <h2 className="settings-page__section-title">
                  {t("preferences")}
                </h2>
              </div>

              {/* Theme Setting */}
              <div className="settings-page__field">
                <div className="settings-page__field-header">
                  <h3 className="settings-page__field-title">{t("theme")}</h3>
                </div>
                <div className="settings-page__button-group">
                  <button
                    onClick={() => {
                      if (theme !== "light") toggleTheme();
                    }}
                    className={`settings-page__button ${
                      theme === "light"
                        ? "settings-page__button--primary"
                        : "settings-page__button--secondary"
                    }`}
                  >
                    <Monitor size={16} />
                    <span>{t("light_theme")}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (theme !== "dark") toggleTheme();
                    }}
                    className={`settings-page__button ${
                      theme === "dark"
                        ? "settings-page__button--primary"
                        : "settings-page__button--secondary"
                    }`}
                  >
                    <Monitor size={16} />
                    <span>{t("dark_theme")}</span>
                  </button>
                </div>
              </div>

              {/* Language Setting */}
              <div className="settings-page__field">
                <div className="settings-page__field-header">
                  <h3 className="settings-page__field-title">
                    {t("language")}
                  </h3>
                </div>
                <div className="settings-page__button-group">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`settings-page__button ${
                      i18n.language === "en"
                        ? "settings-page__button--primary"
                        : "settings-page__button--secondary"
                    }`}
                  >
                    <Globe size={16} />
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => handleLanguageChange("id")}
                    className={`settings-page__button ${
                      i18n.language === "id"
                        ? "settings-page__button--primary"
                        : "settings-page__button--secondary"
                    }`}
                  >
                    <Globe size={16} />
                    <span>Bahasa Indonesia</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="dashboard__section">
            <div className="settings-page__section settings-page__danger-zone">
              <div className="settings-page__section-header">
                <AlertTriangle className="settings-page__section-icon" />
                <h2 className="settings-page__section-title">
                  {t("danger_zone")}
                </h2>
              </div>

              <div className="settings-page__field">
                <div className="settings-page__field-header">
                  <h3 className="settings-page__field-title">
                    {t("delete_account")}
                  </h3>
                </div>
                <div className="settings-page__field-value">
                  {t("delete_account_warning")}
                </div>
                <div className="settings-page__button-group">
                  <button
                    onClick={handleDeleteAccount}
                    className="settings-page__button settings-page__button--danger"
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
    </div>
  );
};

export default SettingsPage;
