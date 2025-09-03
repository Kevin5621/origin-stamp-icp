"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { config } from "@/lib/config";

export const CookieSync: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userData = JSON.stringify(user);
      const principal = user.principal;

      document.cookie = `auth-user=${userData}; path=/; max-age=${config.security.cookieMaxAge}; ${config.security.cookieSecure ? "secure;" : ""} samesite=${config.security.cookieSameSite}`;
      document.cookie = `originstamp_user_principal=${principal}; path=/; max-age=${config.security.cookieMaxAge}; ${config.security.cookieSecure ? "secure;" : ""} samesite=${config.security.cookieSameSite}`;
    }
  }, [user, isAuthenticated]);

  return null;
};
