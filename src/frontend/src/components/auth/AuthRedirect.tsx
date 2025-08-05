import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * AuthRedirect - Component to handle automatic redirects for authenticated users
 * Ensures authenticated users are immediately redirected to dashboard when visiting public pages
 */
const AuthRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is authenticated and on login page or landing page, redirect to dashboard
    if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/")) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return null; // This component doesn't render anything
};

export default AuthRedirect;
