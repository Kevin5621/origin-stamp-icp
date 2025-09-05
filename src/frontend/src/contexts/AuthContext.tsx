"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthClient } from "@dfinity/auth-client";
import { User } from "../types/auth";
import { config } from "../lib/config";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => void;
  loginWithInternetIdentity: (principal: string) => void;
  loginWithGoogle: (userInfo: {
    id: string;
    name: string;
    email: string;
    picture: string;
  }) => void;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  authClient: AuthClient | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const savedUser = localStorage.getItem("auth-user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);

          // Check if principal is valid format for username login
          if (userData.principal && userData.loginMethod === "username") {
            try {
              const { Principal } = await import("@dfinity/principal");
              Principal.fromText(userData.principal);
              // Principal is valid, use as is
              setUser(userData);
              localStorage.setItem(
                "originstamp_user_principal",
                userData.principal,
              );
            } catch (error) {
              console.warn(
                "Invalid principal format detected, migrating user...",
              );
              // Principal is invalid, regenerate it
              if (userData.username) {
                regeneratePrincipalForExistingUser(userData.username);
              } else {
                // No username, clear invalid data
                localStorage.removeItem("auth-user");
                localStorage.removeItem("originstamp_user_principal");
              }
            }
          } else {
            // No principal or not username login, use as is
            setUser(userData);
            if (userData.principal) {
              localStorage.setItem(
                "originstamp_user_principal",
                userData.principal,
              );
            } else if (userData.loginMethod === "username") {
              regeneratePrincipalForExistingUser(userData.username);
            }
          }
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("auth-user");
          localStorage.removeItem("originstamp_user_principal");
        }
      }
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
        // Tidak auto-login, user harus memilih metode login
      } catch (error) {
        console.error("Error initializing AuthClient:", error);
      }
    };

    initAuthClient();
  }, []);

  const login = (username: string) => {
    const generateUsernamePrincipal = async () => {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(username + "originstamp_SALT_2024");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // Take first 8 bytes and create valid Principal
        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
          bytes[i] = hashArray[i] || 0;
        }

        // Create Principal from bytes
        const { Principal } = await import("@dfinity/principal");
        return Principal.fromUint8Array(bytes).toText();
      } catch (error) {
        console.error("Failed to generate principal for username:", error);
        return null;
      }
    };

    generateUsernamePrincipal().then((principal) => {
      if (principal) {
        const userData = {
          username,
          loginTime: new Date().toLocaleString(),
          principal,
          loginMethod: "username" as const,
        };

        setUser(userData);
        localStorage.setItem("auth-user", JSON.stringify(userData));
        localStorage.setItem("originstamp_user_principal", principal);

        document.cookie = `auth-user=${JSON.stringify(userData)}; path=/; max-age=${config.security.cookieMaxAge}; ${config.security.cookieSecure ? "secure;" : ""} samesite=${config.security.cookieSameSite}`;
        document.cookie = `originstamp_user_principal=${principal}; path=/; max-age=${config.security.cookieMaxAge}; ${config.security.cookieSecure ? "secure;" : ""} samesite=${config.security.cookieSameSite}`;
      } else {
        console.error("Failed to generate principal for username:", username);
      }
    });
  };

  const loginWithInternetIdentity = (principal: string) => {
    const userData = {
      username: `User ${principal.slice(0, 8)}...`,
      loginTime: new Date().toLocaleString(),
      principal,
      loginMethod: "icp" as const,
    };
    setUser(userData);
    localStorage.setItem("auth-user", JSON.stringify(userData));
    localStorage.setItem("originstamp_user_principal", principal);

    document.cookie = `auth-user=${JSON.stringify(userData)}; path=/; max-age=${config.security.cookieMaxAge}; ${config.security.cookieSecure ? "secure;" : ""} samesite=${config.security.cookieSameSite}`;
    document.cookie = `originstamp_user_principal=${principal}; path=/; max-age=${config.security.cookieMaxAge}; ${config.security.cookieSecure ? "secure;" : ""} samesite=${config.security.cookieSameSite}`;
  };

  const loginWithGoogle = (userInfo: {
    id: string;
    name: string;
    email: string;
    picture: string;
  }) => {
    const generateGooglePrincipal = async () => {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(
          userInfo.id + "originstamp_GOOGLE_SALT_2024",
        );
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        const principalText = hashHex.slice(0, 16);
        return principalText;
      } catch (error) {
        console.error("Failed to generate principal for Google user:", error);
        return null;
      }
    };

    generateGooglePrincipal().then((principal) => {
      if (principal) {
        const userData = {
          username: userInfo.name,
          loginTime: new Date().toLocaleString(),
          email: userInfo.email,
          picture: userInfo.picture,
          principal,
          loginMethod: "google" as const,
        };

        setUser(userData);
        localStorage.setItem("auth-user", JSON.stringify(userData));
        localStorage.setItem("originstamp_user_principal", principal);

        document.cookie = `auth-user=${JSON.stringify(userData)}; path=/; max-age=${config.security.cookieMaxAge}; ${config.security.cookieSecure ? "secure;" : ""} samesite=${config.security.cookieSameSite}`;
        document.cookie = `originstamp_user_principal=${principal}; path=/; max-age=${config.security.cookieMaxAge}; ${config.security.cookieSecure ? "secure;" : ""} samesite=${config.security.cookieSameSite}`;
      } else {
        console.error(
          "Failed to generate principal for Google user:",
          userInfo.name,
        );
      }
    });
  };

  const logout = async () => {
    if (authClient && user?.loginMethod === "icp") {
      await authClient.logout();
    }
    setUser(null);
    localStorage.removeItem("auth-user");
    localStorage.removeItem("originstamp_user_principal");

    document.cookie =
      "auth-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "originstamp_user_principal=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const regeneratePrincipalForExistingUser = (username: string) => {
    const generateUsernamePrincipal = async () => {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(username + "originstamp_SALT_2024");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // Take first 8 bytes and create valid Principal
        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
          bytes[i] = hashArray[i] || 0;
        }

        // Create Principal from bytes
        const { Principal } = await import("@dfinity/principal");
        return Principal.fromUint8Array(bytes).toText();
      } catch (error) {
        console.error(
          "Failed to regenerate principal for existing user:",
          error,
        );
        return null;
      }
    };

    generateUsernamePrincipal().then((principal) => {
      if (principal) {
        localStorage.setItem("originstamp_user_principal", principal);

        const currentUser = localStorage.getItem("auth-user");
        if (currentUser) {
          try {
            const userData = JSON.parse(currentUser);
            userData.principal = principal;
            localStorage.setItem("auth-user", JSON.stringify(userData));

            setUser(userData);
          } catch (error) {
            console.error(
              "Failed to update user data with new principal:",
              error,
            );
          }
        }
      } else {
        console.error(
          "Failed to regenerate principal for existing user:",
          username,
        );
      }
    });
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("auth-user", JSON.stringify(updatedUser));

    if (updatedUser.principal) {
      localStorage.setItem("originstamp_user_principal", updatedUser.principal);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithInternetIdentity,
    loginWithGoogle,
    logout,
    updateUser,
    authClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
