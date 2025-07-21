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
  login: (username: string) => void;
  loginWithInternetIdentity: (principal: string) => void;
  loginWithGoogle: (userInfo: {
    id: string;
    name: string;
    email: string;
    picture: string;
  }) => void;
  logout: () => Promise<void>;
  authClient: AuthClient | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

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

          const userData = {
            username: `User ${principal.slice(0, 8)}...`,
            loginTime: new Date().toLocaleString(),
            principal,
            loginMethod: "icp" as const,
          };
          setUser(userData);
          localStorage.setItem("auth-user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error initializing AuthClient:", error);
      }
    };

    initAuthClient();
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("auth-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("auth-user");
      }
    }
  }, []);

  const login = (username: string) => {
    const userData = {
      username,
      loginTime: new Date().toLocaleString(),
      loginMethod: "username" as const,
    };
    setUser(userData);
    localStorage.setItem("auth-user", JSON.stringify(userData));
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
  };

  const loginWithGoogle = (userInfo: {
    id: string;
    name: string;
    email: string;
    picture: string;
  }) => {
    const userData = {
      username: userInfo.name,
      loginTime: new Date().toLocaleString(),
      email: userInfo.email,
      picture: userInfo.picture,
      loginMethod: "google" as const,
    };
    setUser(userData);
    localStorage.setItem("auth-user", JSON.stringify(userData));
  };

  const logout = async () => {
    if (authClient && user?.loginMethod === "icp") {
      await authClient.logout();
    }
    setUser(null);
    localStorage.removeItem("auth-user");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithInternetIdentity,
    loginWithGoogle,
    logout,
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
