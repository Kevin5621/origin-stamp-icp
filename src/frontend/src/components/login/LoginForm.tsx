
import React, { useState } from "react";
import type { LoginResult } from "../../../../declarations/backend/backend.did";
import { backendService } from "../../services/backendService";
import { useTranslation } from "react-i18next";


export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LoginResult | null>(null);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert(t("login_fill_username_password"));
      return;
    }

    setLoading(true);
    try {
      const loginResult = await backendService.login(username, password);
      setResult(loginResult);

      if (loginResult.success) {
        alert(t("login_success", { username: loginResult.username[0] }));
        // Here you can redirect or update app state
      } else {
        alert(t("login_failed", { message: loginResult.message }));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(t("login_error"));
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async () => {
    if (!username || !password) {
      alert(t("login_fill_username_password"));
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
        alert(t("register_success"));
      } else {
        alert(t("register_failed", { message: registerResult.message }));
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(t("register_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-raised">
      <h2 className="login-title text-primary">{t("login_register_title")}</h2>

      <form onSubmit={handleLogin} className="login-options">
        <div>
          <label
            htmlFor="username"
            className="text-secondary mb-2 block text-sm font-medium"
          >
            {t("login_username_label")}
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            placeholder={t("login_username_placeholder")}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-secondary mb-2 block text-sm font-medium"
          >
            {t("login_password_label")}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder={t("login_password_placeholder")}
            disabled={loading}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-neumorphic login-btn flex-1"
          >
            {loading ? t("loading") : t("login_button")}
          </button>

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="btn-neumorphic login-btn flex-1"
          >
            {loading ? t("loading") : t("register_button")}
          </button>
        </div>
      </form>

      {result && (
        <div
          className={`card-inset mt-4 rounded-md p-3 ${
            result.success ? "text-success" : "text-error"
          }`}
        >
          <p className="text-sm">
            <strong>{t("login_status_label")}:</strong> {result.success ? t("login_status_success") : t("login_status_failed")}
          </p>
          <p className="text-sm">
            <strong>{t("login_message_label")}:</strong> {result.message}
          </p>
          {result.username?.[0] && (
            <p className="text-sm">
              <strong>{t("login_username_label")}:</strong> {result.username[0]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
