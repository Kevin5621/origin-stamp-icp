import React from "react";
import { useTranslation } from "react-i18next";
import { getInitials } from "../../utils/userUtils";
import { ProfileCard } from "./ProfileCard";
import { LogOut } from "lucide-react";

interface User {
  username: string;
  loginTime: string;
  loginMethod?: "username" | "icp" | "google";
}

interface TransformableAvatarProps {
  user: User;
  isExpanded: boolean;
  onToggle: () => void;
  onLogout: () => void;
  onSettings: () => void;
  className?: string;
}

export const TransformableAvatar: React.FC<TransformableAvatarProps> = ({
  user,
  isExpanded,
  onToggle,
  onLogout,
  onSettings,
  className = "",
}) => {
  const { t } = useTranslation("common");
  const initials = getInitials(user.username);

  return (
    <div
      className={`transformable-avatar ${isExpanded ? "transformable-avatar--expanded" : ""} ${className}`}
    >
      <div
        onClick={onToggle}
        className="transformable-avatar__button"
        role="button"
        tabIndex={0}
        aria-label={isExpanded ? t("close_profile") : t("open_profile")}
        title={isExpanded ? t("close_profile") : t("open_profile")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="transformable-avatar__circle">
          <span className="transformable-avatar__initials">{initials}</span>

          {isExpanded && (
            <>
              <div className="transformable-avatar__content">
                <ProfileCard
                  user={user}
                  onLogout={onLogout}
                  onSettings={onSettings}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logout button dipindah ke luar button utama */}
      {isExpanded && (
        <button
          onClick={onLogout}
          className="profile-card__logout-btn profile-card__logout-btn--floating"
          aria-label={t("logout")}
          title={t("logout")}
          type="button"
        >
          <LogOut size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};
