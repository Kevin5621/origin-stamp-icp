"use client";

import { useEffect, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DashboardGuardProps {
  children: React.ReactNode;
}

export const DashboardGuard: React.FC<DashboardGuardProps> = memo(
  ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const hasRedirectedRef = useRef(false);

    useEffect(() => {
      // Prevent multiple redirects
      if (!isLoading && !isAuthenticated && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.push("/auth/login");
      }
    }, [isAuthenticated, isLoading, router]);

    // Reset redirect flag when authentication state changes
    useEffect(() => {
      if (isAuthenticated) {
        hasRedirectedRef.current = false;
      }
    }, [isAuthenticated]);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner size="lg" variant="infinite" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <>{children}</>;
  },
);

DashboardGuard.displayName = "DashboardGuard";
