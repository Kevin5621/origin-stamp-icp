import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToastContext } from "../../contexts/ToastContext";

interface SignInButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  className = "",
  variant = "primary",
  size = "medium",
}) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { success } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      // Navigate ke halaman login
      navigate("/login");
      success(t("redirecting_to_login"));
    } catch (error) {
      console.error("Error navigating to login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = "sign-in-btn";
  const variantClasses = {
    primary: "sign-in-btn--primary",
    secondary: "sign-in-btn--secondary",
    outline: "sign-in-btn--outline",
  };
  const sizeClasses = {
    small: "sign-in-btn--small",
    medium: "sign-in-btn--medium",
    large: "sign-in-btn--large",
  };

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClasses}
      onClick={handleSignIn}
      disabled={isLoading}
      aria-label={t("sign_in")}
    >
      {isLoading ? (
        <span className="sign-in-btn__loading">
          <svg
            className="sign-in-btn__spinner"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 31.416;15.708 15.708;0 31.416"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-15.708;-31.416"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      ) : (
        <span className="sign-in-btn__text">{t("sign_in")}</span>
      )}
    </button>
  );
};

export default SignInButton;
