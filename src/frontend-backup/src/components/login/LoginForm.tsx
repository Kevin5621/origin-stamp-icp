import React, { useState } from "react";
import type { LoginResult } from "../../../../declarations/backend/backend.did";
import { backendService } from "../../services/backendService";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onBack: () => void;
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onBack,
  onLoginSuccess,
}) => {
  const { t } = useTranslation("auth");
  const { login } = useAuth();
  const { success, error } = useToastContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LoginResult | null>(null);

  const showToast = (
    type: "success" | "error" | "warning" | "info",
    message: string,
  ) => {
    if (type === "success") {
      success(message);
    } else if (type === "error") {
      error(message);
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onBack();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showToast("error", t("login_fill_username_password"));
      return;
    }

    setLoading(true);
    try {
      const loginResult = await backendService.login(username, password);
      setResult(loginResult);

      if (loginResult.success) {
        if (loginResult.username?.[0]) {
          login(loginResult.username[0]);
        }

        showToast(
          "success",
          t("login_success", { username: loginResult.username[0] }),
        );

        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        showToast("error", t("login_failed", { message: loginResult.message }));
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("error", t("login_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      showToast("error", t("login_fill_username_password"));
      return;
    }

    setLoading(true);
    try {
      const registerResult = await backendService.registerUser(
        username,
        password,
      );
      setResult(registerResult);

      if (registerResult.success) {
        // Auto-login after successful registration
        if (registerResult.username?.[0]) {
          login(registerResult.username[0]);
        }

        showToast("success", t("register_success"));

        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        showToast(
          "error",
          t("register_failed", { message: registerResult.message }),
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast("error", t("register_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <button
        onClick={handleBack}
        className="auth-form-back-btn"
        aria-label={t("back_to_options")}
        title={t("back_to_options")}
      >
        <ChevronLeft size={24} />
      </button>

      <div className="auth-form-header">
        <h2 className="auth-form-title">{t("login_register_title")}</h2>
        <p className="auth-form-subtitle">{t("enter_credentials")}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="auth-form-content"
      >
        <div className="auth-form-group">
          <label htmlFor="username" className="auth-form-label">
            {t("login_username_label")}
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault();
                handleLogin();
              }
            }}
            className="auth-form-input"
            placeholder={t("login_username_placeholder")}
            disabled={loading}
            autoComplete="username"
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="password" className="auth-form-label">
            {t("login_password_label")}
          </label>
          <div className="auth-form-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  e.preventDefault();
                  handleLogin();
                }
              }}
              className="auth-form-input"
              placeholder={t("login_password_placeholder")}
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="auth-form-password-toggle"
              aria-label={
                showPassword ? t("hide_password") : t("show_password")
              }
              title={showPassword ? t("hide_password") : t("show_password")}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="auth-form-actions">
          <button
            type="submit"
            disabled={loading}
            className="auth-form-btn auth-form-btn--login"
          >
            {loading ? (
              <span className="auth-form-btn-loading">
                <svg className="auth-form-btn-spinner" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
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
                {t("loading")}
              </span>
            ) : (
              t("login_button")
            )}
          </button>

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="auth-form-btn auth-form-btn--register"
          >
            {loading ? (
              <span className="auth-form-btn-loading">
                <svg className="auth-form-btn-spinner" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
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
                {t("loading")}
              </span>
            ) : (
              t("register_button")
            )}
          </button>
        </div>
      </form>

      {result && (
        <div className="auth-form-result">
          <div className="auth-form-result-header">
            <span
              className={`auth-form-result-status auth-form-result-status--${result.success ? "success" : "error"}`}
            >
              {result.success
                ? t("login_status_success")
                : t("login_status_failed")}
            </span>
          </div>
          <div className="auth-form-result-content">
            <p className="auth-form-result-message">
              <strong>{t("login_message_label")}:</strong> {result.message}
            </p>
            {result.username?.[0] && (
              <p className="auth-form-result-username">
                <strong>{t("login_username_label")}:</strong>{" "}
                {result.username[0]}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
