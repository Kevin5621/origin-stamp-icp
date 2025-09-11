/**
 * Google OAuth Script Loader Component
 * Loads Google Identity Services script and initializes OAuth
 */

"use client";

import { useEffect, useState } from "react";
import { envService } from "../../services/core";

interface GoogleOAuthLoaderProps {
  children: React.ReactNode;
}

export const GoogleOAuthLoader: React.FC<GoogleOAuthLoaderProps> = ({
  children,
}) => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleScript = async () => {
      try {
        // Check if Google script is already loaded
        if (window.google?.accounts?.id) {
          setIsGoogleLoaded(true);
          return;
        }

        // Get Google Client ID from environment
        const clientId = envService.getGoogleClientId();
        if (!clientId) {
          throw new Error("Google Client ID not configured");
        }

        // Create script element
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        // Handle script load success
        script.onload = () => {
          console.log("✅ Google Identity Services script loaded successfully");
          setIsGoogleLoaded(true);
          setLoadError(null);
        };

        // Handle script load error
        script.onerror = () => {
          const errorMsg = "Failed to load Google Identity Services script";
          console.error("❌", errorMsg);
          setLoadError(errorMsg);
        };

        // Add script to document head
        document.head.appendChild(script);

        // Cleanup function
        return () => {
          const existingScript = document.querySelector(
            'script[src="https://accounts.google.com/gsi/client"]',
          );
          if (existingScript) {
            document.head.removeChild(existingScript);
          }
        };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Google OAuth loader error:", errorMsg);
        setLoadError(errorMsg);
      }
    };

    loadGoogleScript();
  }, []);

  // Show error state if script failed to load
  if (loadError) {
    console.warn("⚠️ Google OAuth not available:", loadError);
    // Still render children - Google OAuth will be disabled but app should work
  }

  return <>{children}</>;
};

export default GoogleOAuthLoader;
