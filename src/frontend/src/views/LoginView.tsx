import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginForm } from "../components/login/LoginForm";
import { useTranslation } from "react-i18next";

const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
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

  // TODO: Implement login with ICP (Internet Computer Protocol)
  const handleInternetIdentityLogin = () => {
    // TODO: Add logic for authenticating with Internet Identity (ICP)
    navigate("/dashboard");
  };

  // TODO: Implement login with Gmail (Google)
  const handleGoogleLogin = () => {
    // TODO: Add logic for authenticating with Google (Gmail)
    navigate("/dashboard");
  };

  // TODO: Implement registration with Gmail (Google)
  const handleGoogleSignup = () => {
    // TODO: Add logic for registering a new user with Google (Gmail)
    navigate("/dashboard");
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

export default LoginView;
