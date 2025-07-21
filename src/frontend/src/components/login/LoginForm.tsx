import React, { useState } from "react";
import type { LoginResult } from "../../../../declarations/backend/backend.did";
import { backendService } from "../../services/backendService";
import { useTranslation } from "react-i18next";
import { Toast } from "../common/Toast";
import { useAuth } from "../../contexts/AuthContext";

interface LoginFormProps {
  onBack: () => void;
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onBack,
  onLoginSuccess,
}) => {
  const { t } = useTranslation("common");
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LoginResult | null>(null);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>({
    isVisible: false,
    type: "info",
    message: "",
  });

  const showToast = (
    type: "success" | "error" | "warning" | "info",
    message: string,
  ) => {
    setToast({
      isVisible: true,
      type,
      message,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleBack = (e?: React.MouseEvent) => {
    // Mencegah event bubbling
    if (e) {
      e.stopPropagation();
    }
    // Kembali ke component Login
    onBack();
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
        // Set user ke context autentikasi
        if (loginResult.username?.[0]) {
          login(loginResult.username[0]);
        }

        showToast(
          "success",
          t("login_success", { username: loginResult.username[0] }),
        );

        // Panggil callback untuk menutup modal
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
        showToast("success", t("register_success"));
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
    <>
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={5000}
      />

      <div className="login-form-container">
        {/* Tombol kembali di pojok kanan atas */}
        <button
          onClick={handleBack}
          className="login-form-back-button"
          aria-label="Kembali"
          title="Kembali"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="login-form-header">
          <h2 className="login-form-title">{t("login_register_title")}</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="login-form-content"
        >
          <div className="login-form-group">
            <label htmlFor="username" className="login-form-label">
              {t("login_username_label")}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-form-input"
              placeholder={t("login_username_placeholder")}
              disabled={loading}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-form-label">
              {t("login_password_label")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-form-input"
              placeholder={t("login_password_placeholder")}
              disabled={loading}
            />
          </div>

          <div className="login-form-actions">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="login-form-button login-form-button--secondary"
            >
              {loading ? t("loading") : t("login_button")}
            </button>

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="login-form-button login-form-button--secondary"
            >
              {loading ? t("loading") : t("register_button")}
            </button>
          </div>
        </form>

        {result && (
          <div className="login-form-result">
            <p>
              <strong>{t("login_message_label")}:</strong> {result.message}
            </p>
            {result.username?.[0] && (
              <p>
                <strong>{t("login_username_label")}:</strong>{" "}
                {result.username[0]}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
