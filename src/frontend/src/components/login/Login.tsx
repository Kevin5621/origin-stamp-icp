import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { useAuth } from "../../contexts/AuthContext";
import { TransformableAvatar } from "../profile/TransformableAvatar";
import { AuthClient } from "@dfinity/auth-client";

interface LoginProps {
  readonly className?: string;
}

export function Login({ className = "" }: LoginProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loginWithInternetIdentity } =
    useAuth();
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
        // Delay focus untuk memastikan modal sudah ter-render
        setTimeout(() => {
          firstElement.focus();
        }, 100);
      }
    }
  }, [isModalOpen, showCustomLogin]);

  // Prevent body scroll saat modal terbuka - dengan optimasi
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
    // Return focus ke tombol login dengan delay
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
  }, [logout]);

  const handleProfileToggle = useCallback(() => {
    setIsProfileExpanded(!isProfileExpanded);
  }, [isProfileExpanded]);

  // Implement login with ICP (Internet Computer Protocol)
  const handleInternetIdentityLogin = useCallback(async () => {
    try {
      // Create AuthClient instance
      const authClient = await AuthClient.create();

      // Check if already authenticated
      const isAuthenticated = await authClient.isAuthenticated();
      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        loginWithInternetIdentity(principal);
        handleCloseModal();
        navigate("/dashboard");
        return;
      }

      // Start login process
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
        },
        onError: (error) => {
          console.error("Internet Identity login failed:", error);
          // Keep modal open on error so user can try again
        },
      });
    } catch (error) {
      console.error("Error during Internet Identity login:", error);
      // Keep modal open on error so user can try again
    }
  }, [handleCloseModal, navigate, loginWithInternetIdentity]);

  // TODO: Implement login with Gmail (Google)
  const handleGoogleLogin = useCallback(() => {
    // TODO: Add logic for authenticating with Google (Gmail)
    handleCloseModal();
  }, [handleCloseModal]);

  // TODO: Implement registration with Gmail (Google)
  const handleGoogleSignup = useCallback(() => {
    // TODO: Add logic for registering a new user with Google (Gmail)
    handleCloseModal();
  }, [handleCloseModal]);

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
        ref={loginButtonRef}
        onClick={handleOpenModal}
        className={`btn-login-circular ${className}`.trim()}
        aria-label={t("login_signup")}
        title={t("login_signup")}
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
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            tabIndex={-1}
            onClick={handleCloseModal}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCloseModal();
            }}
          >
            <div
              className="modal-content"
              role="document"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCloseModal();
              }}
            >
              {/* Close button untuk wireframe style */}
              <button
                onClick={handleCloseModal}
                className="modal-close"
                aria-label={t("close_modal")}
                title={t("close_modal")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {!showCustomLogin && (
                <header className="modal-header">
                  <h1 id="login-modal-title" className="login-title">
                    {t("login_signup")}
                  </h1>
                </header>
              )}

              <main className="modal-body">
                {!showCustomLogin ? (
                  <>
                    <p className="login-desc">{t("choose_login_method")}</p>

                    <div className="login-options">
                      <button
                        onClick={handleInternetIdentityLogin}
                        className="login-btn login-btn--icp"
                        aria-label={t("login_with_internet_identity")}
                      >
                        <img
                          src="/assets/ii-logo.svg"
                          alt=""
                          className="login-btn-icon"
                          aria-hidden="true"
                        />
                        <span>{t("login_with_internet_identity")}</span>
                      </button>

                      <button
                        onClick={handleGoogleLogin}
                        className="login-btn login-btn--google"
                        aria-label={t("login_with_google")}
                      >
                        <img
                          src="/assets/google-logo.svg"
                          alt=""
                          className="login-btn-icon"
                          aria-hidden="true"
                        />
                        <span>{t("login_with_google")}</span>
                      </button>

                      <div className="login-or" role="separator">
                        {t("or")}
                      </div>

                      <button
                        onClick={handleGoogleSignup}
                        className="login-btn login-btn--signup"
                        aria-label={t("signup_with_google")}
                      >
                        <img
                          src="/assets/google-logo.svg"
                          alt=""
                          className="login-btn-icon"
                          aria-hidden="true"
                        />
                        <span>{t("signup_with_google")}</span>
                      </button>

                      <button
                        onClick={handleShowCustomLogin}
                        className="login-btn"
                        aria-label={t("login_with_username_password")}
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
          document.getElementById("modal-root")!,
        )}
    </>
  );
}

export default Login;
