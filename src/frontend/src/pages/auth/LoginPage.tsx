import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";
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
  const { t } = useTranslation("common");
  const { success, error } = useToastContext();
  const { isAuthenticated, loginWithInternetIdentity, loginWithGoogle } =
    useAuth();
  const [showCustomLogin, setShowCustomLogin] = useState(false);

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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
      // Create AuthClient instance
      const authClient = await AuthClient.create();

      // Check if already authenticated
      const isAuthenticated = await authClient.isAuthenticated();
      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        loginWithInternetIdentity(principal);
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
            t("login_failed", { message: "Internet Identity login failed" }),
          );
          // Keep page open on error so user can try again
        },
      });
    } catch (err) {
      console.error("Error during Internet Identity login:", err);
      error(t("login_failed", { message: "Internet Identity login failed" }));
      // Keep page open on error so user can try again
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
      error(t("login_failed", { message: "Google login failed" }));
      // Keep page open on error so user can try again
    }
  };

  // Implement registration with Gmail (Google)
  const handleGoogleSignup = async () => {
    try {
      const userInfo = await googleAuthService.signUp();
      loginWithGoogle(userInfo);
      navigate("/dashboard");
      success(t("register_success"));
    } catch (err) {
      console.error("Google signup failed:", err);
      error(t("register_failed", { message: "Google signup failed" }));
      // Keep page open on error so user can try again
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-container">
        <div className="login-page-content">
          <header className="login-page-header">
            <h1 className="login-page-title">{t("login_signup")}</h1>
          </header>

          <main className="login-page-body">
            {!showCustomLogin ? (
              <>
                <p className="login-page-desc">{t("choose_login_method")}</p>
                <div className="login-page-options">
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
                  <div className="login-page-or">{t("or")}</div>
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
                  <button onClick={handleShowCustomLogin} className="login-btn">
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
      </div>
    </div>
  );
};

export default LoginPage;
