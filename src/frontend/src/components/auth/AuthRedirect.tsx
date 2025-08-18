import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * AuthRedirect - Component to handle automatic redirects for authenticated users
 * Only redirects authenticated users from login page to dashboard
 */
const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) {
      return;
    }

    // Only redirect if user is authenticated and on login page
    if (isAuthenticated && location.pathname === "/login") {
      console.log(
        "User authenticated, redirecting to dashboard from login page",
      );
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return null; // This component doesn't render anything
};

export default AuthRedirect;
