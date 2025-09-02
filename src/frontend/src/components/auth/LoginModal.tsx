"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useAuth } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";
import { AuthClient } from "@dfinity/auth-client";
import { googleAuthService } from "../../services/googleAuth";
import { Wallet, User, Globe, Mail } from "lucide-react";
import { cn } from "../../lib/utils";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithInternetIdentity, loginWithGoogle } = useAuth();
  const { success, error } = useToastContext();
  const [showCustomLogin, setShowCustomLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShowCustomLogin(false);
    onClose();
  };

  const handleInternetIdentityLogin = async () => {
    setIsLoading(true);
    try {
      const authClient = await AuthClient.create();

      const isAuthenticated = await authClient.isAuthenticated();
      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        loginWithInternetIdentity(principal);
        success(`Login successful! Welcome User ${principal.slice(0, 8)}...`);
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
          success(`Login successful! Welcome User ${principal.slice(0, 8)}...`);
          handleClose();
        },
        onError: (err) => {
          console.error("Internet Identity login failed:", err);
          error("Internet Identity login failed");
        },
      });
    } catch (err) {
      console.error("Error during Internet Identity login:", err);
      error("Internet Identity login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const userInfo = await googleAuthService.signIn();
      loginWithGoogle(userInfo);
      success(`Login successful! Welcome ${userInfo.name}`);
      handleClose();
    } catch (err) {
      console.error("Google login failed:", err);
      error("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameLogin = () => {
    setShowCustomLogin(true);
  };

  const handleBackToOptions = () => {
    setShowCustomLogin(false);
  };

  if (showCustomLogin) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-background border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Login with Username
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Username"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Password"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleBackToOptions}
                variant="outline"
                className="border-border text-foreground hover:bg-muted flex-1"
              >
                Back
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1">
                Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-background border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            Choose Login Method
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select your preferred authentication method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            onClick={handleInternetIdentityLogin}
            disabled={isLoading}
            className="border-border bg-background text-foreground hover:bg-muted hover:text-foreground h-12 w-full border text-base"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
                <Globe className="text-primary-foreground h-4 w-4" />
              </div>
              <span>Login with Internet Identity</span>
            </div>
          </Button>

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="border-border bg-background text-foreground hover:bg-muted hover:text-foreground h-12 w-full border text-base"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-destructive flex h-6 w-6 items-center justify-center rounded-full">
                <Mail className="text-primary-foreground h-4 w-4" />
              </div>
              <span>Login with Google</span>
            </div>
          </Button>

          <Button
            onClick={handleUsernameLogin}
            disabled={isLoading}
            className="border-border bg-background text-foreground hover:bg-muted hover:text-foreground h-12 w-full border text-base"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-secondary flex h-6 w-6 items-center justify-center rounded-full">
                <User className="text-secondary-foreground h-4 w-4" />
              </div>
              <span>Login with Username</span>
            </div>
          </Button>
        </div>

        {isLoading && (
          <div className="text-muted-foreground text-center">Processing...</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
