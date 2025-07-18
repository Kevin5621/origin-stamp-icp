import React from "react";
import { useTranslation } from "react-i18next";
import { getInitials } from "../../utils/userUtils";
import { ProfileCard } from "./ProfileCard";

interface User {
  username: string;
  loginTime: string;
}

interface TransformableAvatarProps {
  user: User;
  isExpanded: boolean;
  onToggle: () => void;
  onLogout: () => void;
  className?: string;
}

export const TransformableAvatar: React.FC<TransformableAvatarProps> = ({
  user,
  isExpanded,
  onToggle,
  onLogout,
  className = "",
}) => {
  const { t } = useTranslation();
  const initials = getInitials(user.username);

  return (
    <div
      className={`transformable-avatar ${isExpanded ? "transformable-avatar--expanded" : ""} ${className}`}
    >
      <button
        onClick={onToggle}
        className="transformable-avatar__button"
        aria-label={isExpanded ? t("close_profile") : t("open_profile")}
        title={isExpanded ? t("close_profile") : t("open_profile")}
      >
        <div className="transformable-avatar__circle">
          <span className="transformable-avatar__initials">{initials}</span>

          {isExpanded && (
            <div className="transformable-avatar__content">
              <ProfileCard user={user} onLogout={onLogout} />
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
