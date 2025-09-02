import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * AppErrorBoundary - Error Boundary wrapper untuk seluruh aplikasi
 * Menangkap error JavaScript dan menampilkan UI fallback yang user-friendly
 */
const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: any) => {
    // Log error untuk debugging
    console.error(
      "Application Error Boundary caught an error:",
      error,
      errorInfo,
    );

    // Bisa ditambahkan error reporting service di sini
    // contoh: Sentry.captureException(error, { extra: errorInfo });
  };

  const handleReset = () => {
    // Reset state atau lakukan cleanup jika diperlukan
    console.log("Error boundary reset");
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
      resetKeys={[]} // Reset boundary when these values change
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
