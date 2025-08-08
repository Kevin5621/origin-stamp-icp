import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationButton } from "./NotificationButton";
import { LanguageToggle } from "../ui/LanguageToggle";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Login } from "../login/Login";
import { SignInButton } from "../login/SignInButton";

interface FloatingHeaderProps {
  className?: string;
  showOnTop?: boolean;
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  className = "",
  showOnTop = true,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <header
      className={`floating-header floating-header--visible ${className}`}
      style={{
        top: showOnTop ? "0" : "auto",
        bottom: showOnTop ? "auto" : "0",
      }}
    >
      <div className="floating-header-content">
        {isAuthenticated ? (
          // Header untuk user yang sudah login
          <div className="floating-header__authenticated">
            <div className="floating-header__left">
              <NotificationButton />
            </div>
            <div className="floating-header__right">
              <LanguageToggle />
              <ThemeToggle />
              <Login />
            </div>
          </div>
        ) : (
          // Header untuk user yang belum login
          <div className="floating-header__unauthenticated">
            <div className="floating-header__left">
              {/* Logo atau brand bisa ditambahkan di sini */}
            </div>
            <div className="floating-header__right">
              <LanguageToggle />
              <ThemeToggle />
              <SignInButton variant="primary" size="medium" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default FloatingHeader;
