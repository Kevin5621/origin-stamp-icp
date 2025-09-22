/**
 * Google OAuth Status Component
 * Shows Google OAuth configuration status and validation results
 */

"use client";

import { useEffect, useState } from "react";
import { envService } from "../../services/core";
import { googleAuthService } from "../../services/auth/google";

interface GoogleOAuthStatusProps {
  showInProduction?: boolean;
  className?: string;
}

export const GoogleOAuthStatus: React.FC<GoogleOAuthStatusProps> = ({
  showInProduction = false,
  className = "",
}) => {
  const [envStatus, setEnvStatus] = useState<{
    configured: boolean;
    clientId: string;
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  const [serviceStatus, setServiceStatus] = useState<{
    scriptLoaded: boolean;
    initialized: boolean;
    available: boolean;
    clientId: string;
  } | null>(null);

  useEffect(() => {
    // Only show in development or if explicitly enabled
    if (process.env.NODE_ENV === "production" && !showInProduction) {
      return;
    }

    // Get environment status
    const env = envService.getGoogleOAuthStatus();
    setEnvStatus(env);

    // Get service status
    const service = googleAuthService.getStatus();
    setServiceStatus(service);
  }, [showInProduction]);

  // Don't render in production unless explicitly enabled
  if (process.env.NODE_ENV === "production" && !showInProduction) {
    return null;
  }

  if (!envStatus || !serviceStatus) {
    return null;
  }

  const hasErrors = envStatus.errors.length > 0;
  const hasWarnings = envStatus.warnings.length > 0;

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}>
      <div className="bg-background border-border rounded-lg border p-4 shadow-lg">
        <h3 className="text-foreground mb-2 text-sm font-semibold">
          Google OAuth Status
        </h3>

        {/* Environment Status */}
        <div className="mb-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">
              Environment:
            </span>
            <span
              className={`rounded px-2 py-1 text-xs ${
                envStatus.isValid
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {envStatus.isValid ? "Valid" : "Invalid"}
            </span>
          </div>

          {envStatus.clientId && (
            <div className="text-muted-foreground text-xs">
              Client ID: {envStatus.clientId.slice(0, 20)}...
            </div>
          )}
        </div>

        {/* Service Status */}
        <div className="mb-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">
              Service:
            </span>
            <span
              className={`rounded px-2 py-1 text-xs ${
                serviceStatus.available
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {serviceStatus.available ? "Ready" : "Loading"}
            </span>
          </div>

          <div className="text-muted-foreground space-y-1 text-xs">
            <div>Script: {serviceStatus.scriptLoaded ? "✅" : "⏳"}</div>
            <div>Initialized: {serviceStatus.initialized ? "✅" : "⏳"}</div>
          </div>
        </div>

        {/* Errors */}
        {hasErrors && (
          <div className="mb-2">
            <div className="mb-1 text-xs font-medium text-red-600 dark:text-red-400">
              Errors:
            </div>
            {envStatus.errors.map((error, index) => (
              <div
                key={index}
                className="text-xs text-red-600 dark:text-red-400"
              >
                • {error}
              </div>
            ))}
          </div>
        )}

        {/* Warnings */}
        {hasWarnings && (
          <div className="mb-2">
            <div className="mb-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
              Warnings:
            </div>
            {envStatus.warnings.map((warning, index) => (
              <div
                key={index}
                className="text-xs text-yellow-600 dark:text-yellow-400"
              >
                • {warning}
              </div>
            ))}
          </div>
        )}

        {/* Environment Info */}
        <div className="text-muted-foreground text-xs">
          Environment: {process.env.NODE_ENV}
        </div>
      </div>
    </div>
  );
};

export default GoogleOAuthStatus;
