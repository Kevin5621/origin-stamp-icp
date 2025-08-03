import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { useAuth } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";
import { TransformableAvatar } from "../profile/TransformableAvatar";
import { AuthClient } from "@dfinity/auth-client";
import { googleAuthService } from "../../services/googleAuth";
import { X } from "lucide-react";

interface LoginProps {
  readonly className?: string;
}

export function Login({ className = "" }: LoginProps) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { success, error } = useToastContext();
  const {
    user,
    isAuthenticated,
    logout,
    loginWithInternetIdentity,
    loginWithGoogle,
  } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCustomLogin, setShowCustomLogin] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const bodyScrollLockRef = useRef<boolean>(false);

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

  // Handle escape key untuk modal dan profile
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isModalOpen) {
          handleCloseModal();
        } else if (isProfileExpanded) {
          setIsProfileExpanded(false);
        }
      }
    };

    if (isModalOpen || isProfileExpanded) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isModalOpen, isProfileExpanded]);

  // Focus management untuk aksesibilitas
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        setTimeout(() => {
          firstElement.focus();
        }, 100);
      }
    }
  }, [isModalOpen, showCustomLogin]);

  // Prevent body scroll saat modal terbuka
  useEffect(() => {
    if (isModalOpen && !bodyScrollLockRef.current) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.classList.add("modal-open");
      bodyScrollLockRef.current = true;
    } else if (!isModalOpen && bodyScrollLockRef.current) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove("modal-open");
      bodyScrollLockRef.current = false;
    }

    return () => {
      if (bodyScrollLockRef.current) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        document.body.classList.remove("modal-open");
        bodyScrollLockRef.current = false;
      }
    };
  }, [isModalOpen]);

  const handleOpenModal = useCallback(() => {
    if (isAuthenticated) {
      setIsProfileExpanded(!isProfileExpanded);
    } else {
      setIsModalOpen(true);
      setShowCustomLogin(false);
    }
  }, [isAuthenticated, isProfileExpanded]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setShowCustomLogin(false);
    setTimeout(() => {
      if (loginButtonRef.current) {
        loginButtonRef.current.focus();
      }
    }, 150);
  }, []);

  const handleShowCustomLogin = useCallback(() => {
    setShowCustomLogin(true);
  }, []);

  const handleBackToLoginOptions = useCallback(() => {
    setShowCustomLogin(false);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    handleCloseModal();
    navigate("/dashboard");
  }, [handleCloseModal, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    setIsProfileExpanded(false);
    success(t("logout_success"));
  }, [logout, success, t]);

  const handleProfileToggle = useCallback(() => {
    setIsProfileExpanded(!isProfileExpanded);
  }, [isProfileExpanded]);

  // Implement login with ICP (Internet Computer Protocol)
  const handleInternetIdentityLogin = useCallback(async () => {
    try {
      const authClient = await AuthClient.create();

      const isAuthenticated = await authClient.isAuthenticated();
      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        loginWithInternetIdentity(principal);
        handleCloseModal();
        navigate("/dashboard");
        return;
      }

      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        windowOpenerFeatures:
          "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
        onSuccess: () => {
          console.log("Internet Identity login successful");
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          loginWithInternetIdentity(principal);
          handleCloseModal();
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
    } catch (error) {
      console.error("Error during Internet Identity login:", error);
    }
  }, [handleCloseModal, navigate, loginWithInternetIdentity]);

  // Implement login with Gmail (Google)
  const handleGoogleLogin = useCallback(async () => {
    try {
      const userInfo = await googleAuthService.signIn();
      loginWithGoogle(userInfo);
      handleCloseModal();
      navigate("/dashboard");
      success(t("login_success", { username: userInfo.name }));
    } catch (err) {
      console.error("Google login failed:", err);
      error(t("login_failed", { message: t("google_login_failed") }));
    }
  }, [handleCloseModal, navigate, loginWithGoogle, success, error, t]);

  // Implement registration with Gmail (Google)
  const handleGoogleSignup = useCallback(async () => {
    try {
      const userInfo = await googleAuthService.signUp();
      loginWithGoogle(userInfo);
      handleCloseModal();
      navigate("/dashboard");
      success(t("register_success"));
    } catch (err) {
      console.error("Google signup failed:", err);
      error(t("register_failed", { message: t("google_signup_failed") }));
    }
  }, [handleCloseModal, navigate, loginWithGoogle, success, error, t]);

  // Render transformable avatar jika sudah login
  if (isAuthenticated && user) {
    return (
      <div ref={profileRef} className="profile-container">
        <TransformableAvatar
          user={user}
          isExpanded={isProfileExpanded}
          onToggle={handleProfileToggle}
          onLogout={handleLogout}
          onSettings={() => {
            setIsProfileExpanded(false);
            navigate("/settings");
          }}
          className={className}
        />
      </div>
    );
  }

  return (
    <>
      {/* Login button */}
      <button
        ref={loginButtonRef}
        onClick={handleOpenModal}
        className={`login-trigger-btn ${isModalOpen ? "login-trigger-btn--active" : ""} ${className}`.trim()}
        aria-label={t("access_account")}
        title={t("access_account")}
        aria-expanded={isModalOpen}
        aria-haspopup="dialog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
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
            ref={modalRef}
            className="auth-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            tabIndex={-1}
            onClick={handleCloseModal}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCloseModal();
            }}
          >
            <div
              className="auth-modal-content"
              role="document"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCloseModal();
              }}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="auth-modal-close"
                aria-label={t("close_modal")}
                title={t("close_modal")}
              >
                <X size={18} />
              </button>

              {/* Header hanya ditampilkan di halaman pilihan metode autentikasi, tidak di halaman login/register */}
              {!showCustomLogin && (
                <header className="auth-modal-header">
                  <h1 id="auth-modal-title" className="auth-modal-title">
                    {t("welcome_back")}
                  </h1>
                  <p className="auth-modal-subtitle">
                    {t("choose_auth_method")}
                  </p>
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

                    <button
                      onClick={handleGoogleLogin}
                      className="auth-btn auth-btn--google"
                      aria-label={t("login_with_google")}
                    >
                      <img
                        src="/assets/google-logo.svg"
                        alt=""
                        className="auth-btn-icon"
                        aria-hidden="true"
                      />
                      <span>{t("login_with_google")}</span>
                    </button>

                    <div className="auth-divider" role="separator">
                      <span>{t("or")}</span>
                    </div>

                    <button
                      onClick={handleGoogleSignup}
                      className="auth-btn auth-btn--signup"
                      aria-label={t("signup_with_google")}
                    >
                      <img
                        src="/assets/google-logo.svg"
                        alt=""
                        className="auth-btn-icon"
                        aria-hidden="true"
                      />
                      <span>{t("signup_with_google")}</span>
                    </button>

                    <button
                      onClick={handleShowCustomLogin}
                      className="auth-btn auth-btn--custom"
                      aria-label={t("login_with_username_password")}
                    >
                      <span>{t("login_with_username_password")}</span>
                    </button>
                  </div>
                ) : (
                  <LoginForm
                    onBack={handleBackToLoginOptions}
                    onLoginSuccess={handleLoginSuccess}
                  />
                )}
              </main>
            </div>
          </div>,
          document.getElementById("modal-root")!,
        )}
    </>
  );
}

export default Login;
