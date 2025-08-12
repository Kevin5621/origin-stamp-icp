import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useToastContext } from "../contexts/ToastContext";

interface ErrorHandlerOptions {
  /** Custom error handler function */
  onError?: (error: Error, context?: string) => void;
  /** Whether to show toast notification on error */
  showToast?: boolean;
  /** Default context for error logging */
  context?: string;
  /** Duration for toast notification in milliseconds */
  toastDuration?: number;
}

/**
 * Hook untuk menangani error dengan fitur toast notification dan logging
 *
 * @param options - Konfigurasi error handler
 * @returns Object berisi method-method untuk error handling
 *
 * @example
 * ```tsx
 * const { handleError, safeExecute, retryWithBackoff } = useErrorHandler({
 *   showToast: true,
 *   context: "UserProfile",
 *   toastDuration: 5000
 * });
 *
 * // Handle error langsung
 * handleError(new Error("Something went wrong"), "fetchUserData");
 *
 * // Execute function dengan error handling
 * const result = await safeExecute(async () => {
 *   return await fetchUserData();
 * }, "fetchUserData");
 *
 * // Retry dengan exponential backoff
 * const data = await retryWithBackoff(
 *   () => fetchUserData(),
 *   3, // max retries
 *   1000 // base delay
 * );
 * ```
 */
export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const toast = useToastContext();
  const { t } = useTranslation("common");

  const getErrorMessage = useCallback(
    (error: Error): string => {
      // Handle berbagai jenis error dengan translasi
      if (error.name === "NetworkError" || error.message.includes("fetch")) {
        return t("error_network");
      }

      if (error.name === "TypeError" && error.message.includes("JSON")) {
        return t("error_invalid_data");
      }

      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        return t("error_unauthorized");
      }

      if (
        error.message.includes("403") ||
        error.message.includes("Forbidden")
      ) {
        return t("error_forbidden");
      }

      if (
        error.message.includes("404") ||
        error.message.includes("Not Found")
      ) {
        return t("error_not_found");
      }

      if (
        error.message.includes("500") ||
        error.message.includes("Internal Server Error")
      ) {
        return t("error_server");
      }

      if (error.message.includes("timeout")) {
        return t("error_timeout");
      }

      // Default error message dengan translasi
      return error.message || t("error_unknown");
    },
    [t],
  );

  const handleError = useCallback(
    (error: Error, context?: string) => {
      // Call custom error handler jika ada
      if (options.onError) {
        options.onError(error, context);
      }

      // Show toast notification jika diaktifkan
      if (options.showToast) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage, options.toastDuration);
      }
    },
    [options, toast, getErrorMessage],
  );

  const safeExecute = useCallback(
    async <T>(
      fn: () => Promise<T> | T,
      context?: string,
    ): Promise<T | null> => {
      try {
        return await fn();
      } catch (error) {
        handleError(error as Error, context);
        return null;
      }
    },
    [handleError],
  );

  const safeExecuteWithFallback = useCallback(
    async <T>(
      fn: () => Promise<T> | T,
      fallback: T,
      context?: string,
    ): Promise<T> => {
      try {
        return await fn();
      } catch (error) {
        handleError(error as Error, context);
        return fallback;
      }
    },
    [handleError],
  );

  const handleAsyncError = useCallback(
    async <T>(promise: Promise<T>, context?: string): Promise<T | null> => {
      try {
        return await promise;
      } catch (error) {
        handleError(error as Error, context);
        return null;
      }
    },
    [handleError],
  );

  const createErrorBoundary = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => Promise<R> | R,
      context?: string,
    ) => {
      return async (...args: T): Promise<R | null> => {
        try {
          return await fn(...args);
        } catch (error) {
          handleError(error as Error, context);
          return null;
        }
      };
    },
    [handleError],
  );

  const retryWithBackoff = useCallback(
    async <T>(
      fn: () => Promise<T>,
      maxRetries: number = 3,
      baseDelay: number = 1000,
      context?: string,
    ): Promise<T | null> => {
      let lastError: Error;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error as Error;

          if (attempt === maxRetries) {
            handleError(lastError, context);
            return null;
          }

          // Exponential backoff dengan jitter
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      return null;
    },
    [handleError],
  );

  const handleCriticalError = useCallback(
    (error: Error, context?: string) => {
      // Log critical error dengan level yang lebih tinggi
      console.error(
        `[CRITICAL] ${new Date().toISOString()} Error in ${context || options.context || "component"}:`,
        {
          name: error.name,
          message: error.message,
          stack: error.stack,
          context: context || options.context || "component",
          severity: "CRITICAL",
        },
      );

      // Selalu tampilkan toast untuk critical error
      const errorMessage = getErrorMessage(error);
      toast.error(`${t("error_critical")}: ${errorMessage}`, 10000); // 10 detik untuk critical error

      // Call custom error handler jika ada
      if (options.onError) {
        options.onError(error, context);
      }
    },
    [options, toast, getErrorMessage, t],
  );

  return {
    /** Handle error dengan logging dan toast notification */
    handleError,
    /** Execute function dengan error handling, return null jika error */
    safeExecute,
    /** Execute function dengan error handling dan fallback value */
    safeExecuteWithFallback,
    /** Handle promise dengan error handling */
    handleAsyncError,
    /** Create error boundary wrapper untuk function */
    createErrorBoundary,
    /** Execute function dengan retry logic dan exponential backoff */
    retryWithBackoff,
    /** Handle critical error dengan logging level tinggi dan toast panjang */
    handleCriticalError,
    /** Get user-friendly error message berdasarkan jenis error */
    getErrorMessage,
  };
};
