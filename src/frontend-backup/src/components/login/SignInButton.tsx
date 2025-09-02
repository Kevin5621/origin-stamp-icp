import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";
import { LoginForm } from "./LoginForm";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { GoogleUser } from "../../services/googleAuth";
import { X } from "lucide-react";
import { AuthClient } from "@dfinity/auth-client";

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
  const { t } = useTranslation("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      setShowModal(true);
      // Lock body scroll
      document.body.classList.add("auth-modal-open");
    } catch (error) {
      console.error("Error opening login modal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Unlock body scroll
    document.body.classList.remove("auth-modal-open");
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
    <>
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

      {showModal &&
        createPortal(<LoginModal onClose={handleCloseModal} />, document.body)}
    </>
  );
};

// Komponen LoginModal yang hanya menampilkan modal tanpa button
const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { success, error } = useToastContext();
  const { loginWithInternetIdentity, loginWithGoogle } = useAuth();
  const [showCustomLogin, setShowCustomLogin] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleShowCustomLogin = () => {
    setShowCustomLogin(true);
  };

  const handleBackToLoginOptions = () => {
    setShowCustomLogin(false);
  };

  // Handle Internet Identity login
  const handleInternetIdentityLogin = useCallback(async () => {
    try {
      const authClient = await AuthClient.create();
      // Always use production Internet Identity
      const identityProvider = "https://identity.ic0.app/#authorize";

      await authClient.login({
        identityProvider,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        windowOpenerFeatures:
          "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
        onSuccess: () => {
          console.log("Internet Identity login successful");
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          loginWithInternetIdentity(principal);
          onClose();
          navigate("/dashboard");
          success(
            t("login_success", {
              username: `User ${principal.slice(0, 8)}...`,
            }),
          );
        },
        onError: (err) => {
          console.error("Internet Identity login failed:", err);
          error(
            t("login_failed", { message: t("internet_identity_login_failed") }),
          );
        },
      });
    } catch (errorObj) {
      console.error("Error during Internet Identity login:", errorObj);
      error(
        t("login_failed", { message: t("internet_identity_login_failed") }),
      );
    }
  }, [onClose, navigate, loginWithInternetIdentity, success, error, t]);

  // Handle Google login success
  const handleGoogleLoginSuccess = useCallback(
    (userInfo: GoogleUser) => {
      console.log("Google login successful, user info:", userInfo);
      loginWithGoogle(userInfo);
      onClose();
      navigate("/dashboard");
      success(t("login_success", { username: userInfo.name }));
    },
    [onClose, navigate, loginWithGoogle, success, t],
  );

  // Handle Google login error
  const handleGoogleLoginError = useCallback(
    (err: Error) => {
      console.error("Google login failed:", err);
      error(t("login_failed", { message: t("google_login_failed") }));
    },
    [error, t],
  );

  return (
    <div
      className="auth-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {!showCustomLogin && (
          <button
            onClick={onClose}
            className="auth-modal-close"
            aria-label={t("close_modal")}
            title={t("close_modal")}
          >
            <X size={20} />
          </button>
        )}

        {!showCustomLogin && (
          <header className="auth-modal-header">
            <h1 id="auth-modal-title" className="auth-modal-title">
              {t("welcome_back")}
            </h1>
            <p className="auth-modal-subtitle">{t("choose_auth_method")}</p>
          </header>
        )}

        <main className="auth-modal-body">
          {!showCustomLogin ? (
            <div className="auth-options">
              <button
                onClick={handleInternetIdentityLogin}
                className="auth-btn auth-btn--icp"
                aria-label={t("login_with_internet_identity")}
              >
                <img
                  src="/assets/ii-logo.svg"
                  alt=""
                  className="auth-btn-icon"
                  aria-hidden="true"
                />
                <span>{t("login_with_internet_identity")}</span>
              </button>

              <div className="auth-btn auth-btn--google">
                <GoogleLoginButton
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  text="signin_with"
                  theme="outline"
                  size="large"
                />
              </div>

              <button
                onClick={handleShowCustomLogin}
                className="auth-btn auth-btn--icp"
                aria-label={t("login_with_username_password")}
              >
                <span>{t("login_with_username_password")}</span>
              </button>
            </div>
          ) : (
            <LoginForm
              onBack={handleBackToLoginOptions}
              onLoginSuccess={onClose}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default SignInButton;
