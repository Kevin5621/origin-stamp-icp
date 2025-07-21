import { useCallback } from "react";

interface ErrorHandlerOptions {
  onError?: (error: Error, context?: string) => void;
  showToast?: boolean;
  context?: string;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const handleError = useCallback(
    (error: Error, context?: string) => {
      // Log error untuk debugging
      console.error(
        `Error in ${context || options.context || "component"}:`,
        error,
      );

      // Call custom error handler jika ada
      if (options.onError) {
        options.onError(error, context);
      }

      // TODO: Implement toast notification jika diperlukan
      if (options.showToast) {
        // showToastNotification(error.message);
      }
    },
    [options],
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

  return {
    handleError,
    safeExecute,
  };
};
