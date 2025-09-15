"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthRedirectProps {
  children: React.ReactNode;
}

/**
 * Authentication redirect component that automatically redirects users:
 * - Authenticated users → Dashboard
 * - Unauthenticated users → Landing page (current page)
 */
export const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Only redirect if not loading and haven't already redirected
    if (!isLoading && !hasRedirectedRef.current) {
      if (isAuthenticated) {
        // User is authenticated, redirect to dashboard
        hasRedirectedRef.current = true;
        router.replace("/dashboard");
      }
      // If not authenticated, stay on landing page (no redirect needed)
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" variant="infinite" />
      </div>
    );
  }

  // If authenticated, don't render children (will redirect)
  if (isAuthenticated) {
    return null;
  }

  // If not authenticated, show landing page
  return <>{children}</>;
};
