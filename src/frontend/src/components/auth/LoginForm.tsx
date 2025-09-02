"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
  const { login } = useAuth();
  const { success, error } = useToastContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showToast("error", "Username and password cannot be empty");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // Mock registration for now
        await new Promise((resolve) => setTimeout(resolve, 1000));
        showToast("success", "User registered successfully");
        setIsRegistering(false);
      } else {
        // Mock login for now
        await new Promise((resolve) => setTimeout(resolve, 1000));
        login(username);
        showToast("success", `Welcome back, ${username}!`);

        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      showToast(
        "error",
        isRegistering ? "Registration failed" : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setUsername("");
    setPassword("");
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-auto p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl">
            {isRegistering ? "Create Account" : "Sign In"}
          </CardTitle>
        </div>
        <CardDescription>
          {isRegistering
            ? "Enter your details to create your account"
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={togglePasswordVisibility}
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Loading..."
              : isRegistering
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={toggleMode} className="text-sm">
            {isRegistering
              ? "Already have an account? Sign in"
              : "Don't have an account? Create one"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
