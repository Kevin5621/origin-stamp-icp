"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToastContext } from "../../../contexts/ToastContext";
import { LoginForm } from "../../../components/auth/LoginForm";
import { AuthClient } from "@dfinity/auth-client";
import { googleAuthService } from "../../../services/googleAuth";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loginWithInternetIdentity, loginWithGoogle } =
    useAuth();
  const { success, error } = useToastContext();
  const [showCustomLogin, setShowCustomLogin] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  const handleBackToLoginOptions = () => {
    setShowCustomLogin(false);
  };

  const handleShowCustomLogin = () => {
    setShowCustomLogin(true);
  };

  const handleInternetIdentityLogin = async () => {
    try {
      const authClient = await AuthClient.create();

      const isAuthenticated = await authClient.isAuthenticated();
      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        loginWithInternetIdentity(principal);
        router.push("/dashboard");
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
          router.push("/dashboard");
          success(`Login successful! Welcome User ${principal.slice(0, 8)}...`);
        },
        onError: (err) => {
          console.error("Internet Identity login failed:", err);
          error("Internet Identity login failed");
        },
      });
    } catch (err) {
      console.error("Error during Internet Identity login:", err);
      error("Internet Identity login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userInfo = await googleAuthService.signIn();
      loginWithGoogle(userInfo);
      router.push("/dashboard");
      success(`Login successful! Welcome ${userInfo.name}`);
    } catch (err) {
      console.error("Google login failed:", err);
      error("Google login failed");
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!showCustomLogin ? (
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Choose your authentication method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleInternetIdentityLogin}
                className="h-12 w-full text-base"
                variant="outline"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                    <span className="text-xs font-bold text-white">IC</span>
                  </div>
                  <span>Login with Internet Identity</span>
                </div>
              </Button>

              <Button
                onClick={handleGoogleLogin}
                className="h-12 w-full text-base"
                variant="outline"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600">
                    <span className="text-xs font-bold text-white">G</span>
                  </div>
                  <span>Login with Google</span>
                </div>
              </Button>

              <Button
                onClick={handleShowCustomLogin}
                className="h-12 w-full text-base"
                variant="outline"
              >
                <span>Login with Username & Password</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <LoginForm
            onBack={handleBackToLoginOptions}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
