import React from "react";
import { useTranslation } from "react-i18next";
import { getInitials } from "../../utils/userUtils";

interface User {
  username: string;
  loginTime: string;
}

interface ProfileCardProps {
  user: User;
  onLogout: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const initials = getInitials(user.username);

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
          <span className="profile-card__label">{t("login_time")}:</span>
          <span className="profile-card__value">{user.loginTime}</span>
        </div>
      </div>

      <div className="profile-card__actions">
        <button
          onClick={onLogout}
          className="profile-card__logout-btn"
          aria-label={t("logout")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>{t("logout")}</span>
        </button>
      </div>
    </div>
  );
};
