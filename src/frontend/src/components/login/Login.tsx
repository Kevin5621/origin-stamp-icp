import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { useAuth } from "../../contexts/AuthContext";
import { TransformableAvatar } from "../profile/TransformableAvatar";

interface LoginProps {
  readonly className?: string;
}

export function Login({ className = "" }: LoginProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCustomLogin, setShowCustomLogin] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle click outside profile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileExpanded(false);
      }
    };

    if (isProfileExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileExpanded]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileExpanded(false);
      }
    };

    if (isProfileExpanded) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isProfileExpanded]);

  const handleOpenModal = () => {
    if (isAuthenticated) {
      // Toggle profile expansion
      setIsProfileExpanded(!isProfileExpanded);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowCustomLogin(false);
  };

  const handleShowCustomLogin = () => {
    setShowCustomLogin(true);
  };

  const handleBackToLoginOptions = () => {
    setShowCustomLogin(false);
  };

  const handleLoginSuccess = () => {
    handleCloseModal();
    // Redirect ke dashboard setelah login berhasil
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    setIsProfileExpanded(false);
  };

  const handleProfileToggle = () => {
    setIsProfileExpanded(!isProfileExpanded);
  };

  // TODO: Implement login with ICP (Internet Computer Protocol)
  const handleInternetIdentityLogin = () => {
    // TODO: Add logic for authenticating with Internet Identity (ICP)
    handleCloseModal();
  };

  // TODO: Implement login with Gmail (Google)
  const handleGoogleLogin = () => {
    // TODO: Add logic for authenticating with Google (Gmail)
    handleCloseModal();
  };

  // TODO: Implement registration with Gmail (Google)
  const handleGoogleSignup = () => {
    // TODO: Add logic for registering a new user with Google (Gmail)
    handleCloseModal();
  };

  // Render transformable avatar jika sudah login
  if (isAuthenticated && user) {
    return (
      <div ref={profileRef} className="profile-container">
        <TransformableAvatar
          user={user}
          isExpanded={isProfileExpanded}
          onToggle={handleProfileToggle}
          onLogout={handleLogout}
          className={className}
        />
      </div>
    );
  }

  return (
    <>
      {/* Circular login button using semantic class and translation */}
      <button
        onClick={handleOpenModal}
        className={`btn-login-circular ${className}`.trim()}
        aria-label={t("login_signup")}
        title={t("login_signup")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </button>

      {isModalOpen &&
        createPortal(
          <div
            className="modal-overlay"
            role="dialog"
            tabIndex={0}
            onClick={handleCloseModal}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter") handleCloseModal();
            }}
          >
            <div
              className="modal-content"
              role="document"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCloseModal();
              }}
            >
              {/* Header hanya muncul saat tidak di LoginForm */}
              {!showCustomLogin && (
                <header className="modal-header">
                  <h2 className="text-primary login-title">
                    {t("login_signup")}
                  </h2>
                </header>
              )}
              <main className="modal-body">
                {!showCustomLogin ? (
                  <>
                    <p className="text-secondary login-desc">
                      {t("choose_login_method")}
                    </p>
                    <div className="login-options">
                      <button
                        onClick={handleInternetIdentityLogin}
                        className="login-btn login-btn--icp"
                      >
                        <img
                          src="/assets/ii-logo.svg"
                          alt="ICP"
                          className="login-btn-icon"
                        />
                        <span>{t("login_with_internet_identity")}</span>
                      </button>
                      <button
                        onClick={handleGoogleLogin}
                        className="login-btn login-btn--google"
                      >
                        <img
                          src="/assets/google-logo.svg"
                          alt="Google"
                          className="login-btn-icon"
                        />
                        <span>{t("login_with_google")}</span>
                      </button>
                      <div className="text-secondary login-or">{t("or")}</div>
                      <button
                        onClick={handleGoogleSignup}
                        className="login-btn login-btn--signup"
                      >
                        <img
                          src="/assets/google-logo.svg"
                          alt="Google"
                          className="login-btn-icon"
                        />
                        <span>{t("signup_with_google")}</span>
                      </button>
                      <button
                        onClick={handleShowCustomLogin}
                        className="login-btn"
                      >
                        <span>{t("login_with_username_password")}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <LoginForm
                    onBack={handleBackToLoginOptions}
                    onLoginSuccess={handleLoginSuccess}
                  />
                )}
              </main>
            </div>
          </div>,
          document.getElementById("modal-root")!
        )}
    </>
  );
}

export default Login;
