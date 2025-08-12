import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { LoginForm } from "../../components/login/LoginForm";
import { useTranslation } from "react-i18next";
import { AuthClient } from "@dfinity/auth-client";
import { googleAuthService } from "../../services/googleAuth";

/**
 * Login Page - Halaman login
 * Tidak memerlukan autentikasi
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { success, error } = useToast();
  const { isAuthenticated, loginWithInternetIdentity, loginWithGoogle } =
    useAuth();
  const [showCustomLogin, setShowCustomLogin] = useState(false);

  // Immediate redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Also check immediately on component mount
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  const handleBackToLoginOptions = () => {
    setShowCustomLogin(false);
  };

  const handleShowCustomLogin = () => {
    setShowCustomLogin(true);
  };

  // Implement login with ICP (Internet Computer Protocol)
  const handleInternetIdentityLogin = async () => {
    try {
      const authClient = await AuthClient.create();

      const isAuthenticated = await authClient.isAuthenticated();
      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        loginWithInternetIdentity(principal);
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
    } catch (err) {
      console.error("Error during Internet Identity login:", err);
      error(
        t("login_failed", { message: t("internet_identity_login_failed") }),
      );
    }
  };

  // Implement login with Gmail (Google)
  const handleGoogleLogin = async () => {
    try {
      const userInfo = await googleAuthService.signIn();
      loginWithGoogle(userInfo);
      navigate("/dashboard");
      success(t("login_success", { username: userInfo.name }));
    } catch (err) {
      console.error("Google login failed:", err);
      error(t("login_failed", { message: t("google_login_failed") }));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-container">
        <div className="auth-page-content">
          {/* Header hanya ditampilkan di halaman pilihan metode autentikasi, tidak di halaman login/register */}
          {!showCustomLogin && (
            <header className="auth-page-header">
              <h1 className="auth-page-title">{t("welcome_back")}</h1>
              <p className="auth-page-subtitle">{t("choose_auth_method")}</p>
            </header>
          )}

          <main className="auth-page-body">
            {!showCustomLogin ? (
              <div className="auth-page-options">
                <button
                  onClick={handleInternetIdentityLogin}
                  className="auth-page-btn auth-page-btn--icp"
                >
                  <img
                    src="/assets/ii-logo.svg"
                    alt="ICP"
                    className="auth-page-btn-icon"
                  />
                  <span>{t("login_with_internet_identity")}</span>
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="auth-page-btn auth-page-btn--icp"
                >
                  <img
                    src="/assets/google-logo.svg"
                    alt="Google"
                    className="auth-page-btn-icon"
                  />
                  <span>{t("login_with_google")}</span>
                </button>
                <button
                  onClick={handleShowCustomLogin}
                  className="auth-page-btn auth-page-btn--icp"
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
      </div>
    </div>
  );
};

export default LoginPage;
