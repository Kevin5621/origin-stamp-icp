/**
 * Google OAuth Button Component
 * A reusable button component for Google OAuth authentication
 */

"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading-spinner";
import { googleAuthService } from "../../services/auth/google";
import { useToastContext } from "../../contexts/ToastContext";
import Image from "next/image";

interface GoogleOAuthButtonProps {
  onSuccess?: (userInfo: {
    id: string;
    name: string;
    email: string;
    picture: string;
  }) => void;
  onError?: (error: Error) => void;
  variant?: "signin" | "signup";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  onSuccess,
  onError,
  variant = "signin",
  size = "md",
  className = "",
  disabled = false,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToastContext();

  const handleGoogleAuth = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);

    try {
      const userInfo =
        variant === "signin"
          ? await googleAuthService.signIn()
          : await googleAuthService.signUp();

      success(
        `Welcome${variant === "signin" ? " back" : ""}, ${userInfo.name}!`,
      );
      onSuccess?.(userInfo);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Google authentication failed";
      error(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (children) return children;

    const baseText =
      variant === "signin" ? "Continue with Google" : "Sign up with Google";
    return isLoading ? "Connecting..." : baseText;
  };

  const getButtonSize = () => {
    switch (size) {
      case "sm":
        return "h-10 text-sm";
      case "lg":
        return "h-14 text-lg";
      default:
        return "h-12 text-base";
    }
  };

  return (
    <Button
      onClick={handleGoogleAuth}
      disabled={isLoading || disabled}
      className={`border-border bg-background text-foreground hover:bg-muted hover:text-foreground w-full border transition-all duration-200 ${getButtonSize()} ${className}`}
    >
      <div className="flex items-center space-x-3">
        {isLoading ? (
          <LoadingSpinner size="sm" variant="infinite" />
        ) : (
          <Image
            src="/google-logo.svg"
            alt="Google"
            width={20}
            height={20}
            className="h-5 w-5"
          />
        )}
        <span>{getButtonText()}</span>
      </div>
    </Button>
  );
};

export default GoogleOAuthButton;
