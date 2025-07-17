import React, { useState } from "react";
import type { LoginResult } from "../../../declarations/backend/backend.did";
import { backendService } from "../../services/backendService";

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LoginResult | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in both username and password");
      return;
    }

    setLoading(true);
    try {
      const loginResult = await backendService.login(username, password);
      setResult(loginResult);

      if (loginResult.success) {
        alert(`Login successful! Welcome, ${loginResult.username[0]}`);
        // Here you can redirect or update app state
      } else {
        alert(`Login failed: ${loginResult.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please fill in both username and password");
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
        alert(`Registration successful! You can now login.`);
      } else {
        alert(`Registration failed: ${registerResult.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-raised">
      <h2 className="login-title text-primary">Login / Register</h2>

      <form onSubmit={handleLogin} className="login-options">
        <div>
          <label
            htmlFor="username"
            className="text-secondary mb-2 block text-sm font-medium"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            placeholder="Enter your username"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-secondary mb-2 block text-sm font-medium"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-neumorphic login-btn flex-1"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="btn-neumorphic login-btn flex-1"
          >
            {loading ? "Loading..." : "Register"}
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
            <strong>Status:</strong> {result.success ? "Success" : "Failed"}
          </p>
          <p className="text-sm">
            <strong>Message:</strong> {result.message}
          </p>
          {result.username && result.username[0] && (
            <p className="text-sm">
              <strong>Username:</strong> {result.username[0]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
