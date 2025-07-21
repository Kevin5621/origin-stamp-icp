import React from "react";
import { useTranslation } from "react-i18next";
import { getInitials } from "../../utils/userUtils";
import { Settings } from "lucide-react";

interface User {
  username: string;
  loginTime: string;
  loginMethod?: "username" | "icp" | "google";
}

interface ProfileCardProps {
  user: User;
  onLogout: () => void;
  onSettings: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onLogout,
  onSettings,
}) => {
  const { t } = useTranslation("common");
  const initials = getInitials(user.username);

  const getLoginMethodLabel = (method?: string) => {
    switch (method) {
      case "username":
        return t("login_method_username");
      case "icp":
        return t("login_method_icp");
      case "google":
        return t("login_method_google");
      default:
        return t("login_method_unknown");
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-card__header">
        <div className="profile-card__avatar">
          <span className="profile-card__initials">{initials}</span>
        </div>
        <div className="profile-card__info">
          <h3 className="profile-card__username">{user.username}</h3>
          <p className="profile-card__status">{t("online")}</p>
        </div>
      </div>

      <div className="profile-card__content">
        <div className="profile-card__credential">
          <span className="profile-card__label">{t("username")}:</span>
          <span className="profile-card__value">{user.username}</span>
        </div>
        <div className="profile-card__credential">
          <span className="profile-card__label">{t("login_method")}:</span>
          <span className="profile-card__value">
            {getLoginMethodLabel(user.loginMethod)}
          </span>
        </div>
        <div className="profile-card__credential">
          <span className="profile-card__label">{t("login_time")}:</span>
          <span className="profile-card__value">{user.loginTime}</span>
        </div>
      </div>

      <div className="profile-card__actions">
        <button
          onClick={onSettings}
          className="profile-card__settings-btn"
          aria-label={t("settings")}
        >
          <Settings size={16} strokeWidth={2} />
          <span>{t("settings")}</span>
        </button>
      </div>
    </div>
  );
};
