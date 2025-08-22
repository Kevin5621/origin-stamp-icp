import React, { useState } from "react";

interface ProfileCardProps {
  className?: string;
  username?: string;
  loginMethod?: string;
  loginTime?: string;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  className = "",
  username = "admin_user",
  loginMethod = "Username & Password",
  loginTime = "8/12/2025, 8:09:14 PM",
  onSettingsClick,
  onLogoutClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    onLogoutClick?.();
    setIsExpanded(false);
  };

  return (
    <div
      className={`transformable-avatar ${isExpanded ? "transformable-avatar--expanded" : ""} ${className}`}
    >
      <button
        className="transformable-avatar__button"
        onClick={handleAvatarClick}
        aria-label={isExpanded ? "Tutup profil" : "Buka profil"}
      >
        <div className="transformable-avatar__circle">
          <span className="transformable-avatar__initials">
            {getInitials(username)}
          </span>

          <div className="transformable-avatar__content">
            <div className="profile-card">
              <div className="profile-card__header">
                <div className="profile-card__avatar">
                  <span className="profile-card__initials">
                    {getInitials(username)}
                  </span>
                </div>

                <div className="profile-card__info">
                  <h3 className="profile-card__username">{username}</h3>
                  <p className="profile-card__status">Daring</p>
                </div>

                <button
                  className="profile-card__logout-btn--floating"
                  onClick={handleLogout}
                  aria-label="Tutup Profil"
                  title="Tutup Profil"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="12" x2="21" y2="12" />
                    <polyline points="16,8 21,12 16,16" />
                  </svg>
                </button>
              </div>

              <div className="profile-card__content">
                <div className="profile-card__credential">
                  <span className="profile-card__label">Nama Pengguna:</span>
                  <span className="profile-card__value">{username}</span>
                </div>

                <div className="profile-card__credential">
                  <span className="profile-card__label">Metode Login:</span>
                  <span className="profile-card__value">{loginMethod}</span>
                </div>

                <div className="profile-card__credential">
                  <span className="profile-card__label">Waktu Masuk:</span>
                  <span className="profile-card__value">{loginTime}</span>
                </div>
              </div>

              <div className="profile-card__actions">
                <button
                  className="profile-card__settings-btn"
                  onClick={onSettingsClick}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Pengaturan
                </button>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ProfileCard;
