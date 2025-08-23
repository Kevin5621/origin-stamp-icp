import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthClient } from "@dfinity/auth-client";

interface User {
  username: string;
  loginTime: string;
  principal?: string; // Add principal for Internet Identity
  email?: string; // Add email for Google authentication
  picture?: string; // Add profile picture for Google authentication
  loginMethod?: "username" | "icp" | "google"; // Track authentication method
}

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

  // Load user from localStorage first (immediate authentication check)
  useEffect(() => {
    const savedUser = localStorage.getItem("auth-user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);

        // Ensure principal is stored in the same location as AuthService
        if (userData.principal) {
          localStorage.setItem(
            "originstamp_user_principal",
            userData.principal,
          );
        } else {
          // Regenerate principal for existing user if missing
          if (userData.loginMethod === "username") {
            regeneratePrincipalForExistingUser(userData.username);
          }
        }
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("auth-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Initialize AuthClient
  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);

        // Check if user is already authenticated with Internet Identity
        const isAuthenticated = await client.isAuthenticated();

        if (isAuthenticated) {
          const identity = client.getIdentity();
          const principal = identity.getPrincipal().toString();

          // Only auto-login if no user is already logged in
          const savedUser = localStorage.getItem("auth-user");
          if (!savedUser) {
            const userData = {
              username: `User ${principal.slice(0, 8)}...`,
              loginTime: new Date().toLocaleString(),
              principal,
              loginMethod: "icp" as const,
            };
            setUser(userData);
            localStorage.setItem("auth-user", JSON.stringify(userData));

            // Store principal in the same location as AuthService
            localStorage.setItem("originstamp_user_principal", principal);
          }
        }
      } catch (error) {
        console.error("Error initializing AuthClient:", error);
      }
    };

    initAuthClient();
  }, []);

  const login = (username: string) => {
    // Generate a deterministic principal for username login
    const generateUsernamePrincipal = async () => {
      try {
        // Create a deterministic hash from username
        const encoder = new TextEncoder();
        const data = encoder.encode(username + "originstamp_SALT_2024");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        // Convert to principal format (first 16 characters)
        const principalText = hashHex.slice(0, 16);
        return principalText;
      } catch (error) {
        console.error("Failed to generate principal for username:", error);
        return null;
      }
    };

    // Generate principal and create user data
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

        // Store principal in the same location as AuthService
        localStorage.setItem("originstamp_user_principal", principal);
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

    // Also store principal in the same location as AuthService
    localStorage.setItem("originstamp_user_principal", principal);
  };

  const loginWithGoogle = (userInfo: {
    id: string;
    name: string;
    email: string;
    picture: string;
  }) => {
    // Generate a deterministic principal for Google login
    const generateGooglePrincipal = async () => {
      try {
        // Create a deterministic hash from Google user ID
        const encoder = new TextEncoder();
        const data = encoder.encode(
          userInfo.id + "originstamp_GOOGLE_SALT_2024",
        );
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        // Convert to principal format (first 16 characters)
        const principalText = hashHex.slice(0, 16);
        return principalText;
      } catch (error) {
        console.error("Failed to generate principal for Google user:", error);
        return null;
      }
    };

    // Generate principal and create user data
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

        // Store principal in the same location as AuthService
        localStorage.setItem("originstamp_user_principal", principal);
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

    // Remove principal from the same location as AuthService
    localStorage.removeItem("originstamp_user_principal");
  };

  // Helper function to regenerate principal for existing users
  const regeneratePrincipalForExistingUser = (username: string) => {
    const generateUsernamePrincipal = async () => {
      try {
        // Create a deterministic hash from username
        const encoder = new TextEncoder();
        const data = encoder.encode(username + "originstamp_SALT_2024");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        // Convert to principal format (first 16 characters)
        const principalText = hashHex.slice(0, 16);
        return principalText;
      } catch (error) {
        console.error(
          "Failed to regenerate principal for existing user:",
          error,
        );
        return null;
      }
    };

    // Generate principal and update user data
    generateUsernamePrincipal().then((principal) => {
      if (principal) {
        // Update localStorage with new principal
        localStorage.setItem("originstamp_user_principal", principal);

        // Update user data with new principal
        const currentUser = localStorage.getItem("auth-user");
        if (currentUser) {
          try {
            const userData = JSON.parse(currentUser);
            userData.principal = principal;
            localStorage.setItem("auth-user", JSON.stringify(userData));

            // Update state
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

    // Update principal in localStorage if available
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
