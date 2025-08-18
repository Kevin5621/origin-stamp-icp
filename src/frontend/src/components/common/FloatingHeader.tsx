import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LanguageToggle } from "../ui/LanguageToggle";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Login } from "../login/Login";
import { SignInButton } from "../login/SignInButton";

interface AppTopHeaderProps {
  className?: string;
}

export const AppTopHeader: React.FC<AppTopHeaderProps> = ({
  className = "",
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className={`app-top-header ${className}`}>
      <div className="app-top-header-content">
        {isAuthenticated ? (
          <div className="app-top-header__authenticated">
            <div className="app-top-header__left">
              {/* Logo atau brand bisa ditambahkan di sini */}
            </div>
            <div className="app-top-header__right">
              <LanguageToggle />
              <ThemeToggle />
              <Login />
            </div>
          </div>
        ) : (
          <div className="app-top-header__unauthenticated">
            <div className="app-top-header__left">
              {/* Logo atau brand bisa ditambahkan di sini */}
            </div>
            <div className="app-top-header__right">
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

// Keep the old export for backward compatibility
export const FloatingHeader = AppTopHeader;
export default AppTopHeader;
