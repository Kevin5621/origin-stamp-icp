import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LanguageToggle } from "../ui/LanguageToggle";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Login } from "../login/Login";
import { SignInButton } from "../login/SignInButton";

interface LandingHeaderProps {
  className?: string;
  showLogo?: boolean;
  logoText?: string;
}

/**
 * Dedicated Header Component for Landing Page and How It Works Page
 * Features floating design with toggle buttons and sign-in action
 */
export const LandingHeader: React.FC<LandingHeaderProps> = ({
  className = "",
  showLogo = true,
  logoText = "OriginStamp",
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleLogoClick();
    }
  };

  return (
    <header className={`landing-header ${className}`}>
      <div className="landing-header__container">
        {showLogo && (
          <button
            className="landing-header__logo"
            onClick={handleLogoClick}
            onKeyDown={handleKeyDown}
            aria-label={`Go to home page - ${logoText}`}
          >
            <h1 className="landing-header__title">{logoText}</h1>
          </button>
        )}

        <div className="landing-header__actions">
          <div className="landing-header__toggles">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {isAuthenticated ? (
            <Login />
          ) : (
            <SignInButton variant="primary" size="medium" />
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
