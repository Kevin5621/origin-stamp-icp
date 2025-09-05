"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAuth } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";
import { AuthClient } from "@dfinity/auth-client";
import { googleAuthService } from "../../services/googleAuth";
import { AuthService } from "../../services/authService";
import { User, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, loginWithInternetIdentity, loginWithGoogle } = useAuth();
  const { success, error, warning } = useToastContext();
  const [showCustomLogin, setShowCustomLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<string>("");

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleClose = () => {
    setShowCustomLogin(false);
    setAuthMethod("");
    setUsername("");
    setPassword("");
    setIsRegistering(false);
    onClose();
  };

  const handleInternetIdentityLogin = async () => {
    setIsLoading(true);
    setAuthMethod("icp");

    try {
      const authClient = await AuthClient.create();

      const isAuthenticated = await authClient.isAuthenticated();
      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        loginWithInternetIdentity(principal);
        success(`Welcome back! User ${principal.slice(0, 8)}...`);
        handleClose();
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
          success(`Welcome! User ${principal.slice(0, 8)}...`);
          handleClose();
        },
        onError: (err) => {
          console.error("Internet Identity login failed:", err);
          error("Internet Identity login failed. Please try again.");
        },
      });
    } catch (err) {
      console.error("Error during Internet Identity login:", err);
      error("Internet Identity login failed. Please try again.");
    } finally {
      setIsLoading(false);
      setAuthMethod("");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthMethod("google");

    try {
      const userInfo = await googleAuthService.signIn();
      loginWithGoogle(userInfo);
      success(`Welcome back, ${userInfo.name}!`);
      handleClose();
    } catch (err) {
      console.error("Google login failed:", err);
      error("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
      setAuthMethod("");
    }
  };

  const handleUsernameLogin = () => {
    setShowCustomLogin(true);
    setAuthMethod("username");
  };

  const handleBackToOptions = () => {
    setShowCustomLogin(false);
    setAuthMethod("");
    setUsername("");
    setPassword("");
    setIsRegistering(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      warning("Please fill in all fields");
      return;
    }

    if (username.trim().length < 3) {
      warning("Username must be at least 3 characters long");
      return;
    }

    if (password.length < 6) {
      warning("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        const result = await AuthService.registerUser(
          username.trim(),
          password,
        );

        if (result.success) {
          success(`Account created successfully! Welcome, ${result.username}!`);
          login(result.username || username);
          handleClose();
        } else {
          error(result.message);
        }
      } else {
        const result = await AuthService.loginUser(username.trim(), password);

        if (result.success) {
          success(`Welcome back, ${result.username}!`);
          login(result.username || username);
          handleClose();
        } else {
          error(result.message);
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setUsername("");
    setPassword("");
  };

  if (showCustomLogin) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-background border-border max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToOptions}
                className="text-muted-foreground hover:text-foreground h-auto p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle className="text-foreground text-xl">
                  {isRegistering ? "Create Account" : "Sign In"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {isRegistering
                    ? "Create your account to get started"
                    : "Enter your credentials to access your account"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="h-11"
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
                  disabled={isLoading}
                  className="h-11 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 py-2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 flex-1"
              >
                {isLoading ? (
                  <LoadingSpinner
                    size="sm"
                    variant="infinite"
                    className="mr-2"
                  />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                {isLoading
                  ? "Processing..."
                  : isRegistering
                    ? "Create Account"
                    : "Sign In"}
              </Button>
            </div>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={toggleMode}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Don't have an account? Create one"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-background border-border max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-foreground text-2xl font-semibold">
            Connect to OriginStamp
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            Choose your preferred authentication method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            onClick={handleInternetIdentityLogin}
            disabled={isLoading}
            className="border-border bg-background text-foreground hover:bg-muted hover:text-foreground h-12 w-full border text-base transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              {isLoading && authMethod === "icp" ? (
                <LoadingSpinner size="md" variant="infinite" />
              ) : (
                <Image
                  src="/ii-logo.svg"
                  alt="ICP"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              )}
              <span>Continue with Internet Identity</span>
            </div>
          </Button>

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="border-border bg-background text-foreground hover:bg-muted hover:text-foreground h-12 w-full border text-base transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              {isLoading && authMethod === "google" ? (
                <LoadingSpinner size="md" variant="infinite" />
              ) : (
                <Image
                  src="/google-logo.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              )}
              <span>Continue with Google</span>
            </div>
          </Button>

          <Button
            onClick={handleUsernameLogin}
            disabled={isLoading}
            className="border-border bg-background text-foreground hover:bg-muted hover:text-foreground h-12 w-full border text-base transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              {isLoading && authMethod === "username" ? (
                <LoadingSpinner size="md" variant="infinite" />
              ) : (
                <User className="h-5 w-5" />
              )}
              <span>Continue with Username</span>
            </div>
          </Button>
        </div>

        {isLoading && (
          <div className="text-muted-foreground flex items-center justify-center space-x-2 text-center">
            <LoadingSpinner size="sm" variant="infinite" />
            <span>Connecting...</span>
          </div>
        )}

        <div className="text-muted-foreground pt-4 text-center text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};
