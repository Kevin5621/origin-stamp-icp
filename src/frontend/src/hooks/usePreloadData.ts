import { useEffect, useRef, useState } from "react";

interface PreloadOptions {
  immediate?: boolean;
  background?: boolean;
  cacheTime?: number;
  retryCount?: number;
  retryDelay?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export function usePreloadData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: PreloadOptions = {},
) {
  const {
    immediate = true,
    background = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const getCachedData = (): T | null => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }
    if (cached) {
      cacheRef.current.delete(key);
    }
    return null;
  };

  const setCachedData = (newData: T) => {
    cacheRef.current.set(key, {
      data: newData,
      timestamp: Date.now(),
      expiresAt: Date.now() + cacheTime,
    });
  };

  const fetchData = async (
    isRetry = false,
    retryAttempt = 0,
  ): Promise<void> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      if (!isRetry) {
        setLoading(true);
        setError(null);
      }

      const result = await fetchFn();

      if (signal.aborted) return;

      setData(result);
      setCachedData(result);
      setLoading(false);
    } catch (err) {
      if (signal.aborted) return;

      if (err instanceof Error && err.name === "AbortError") return;

      if (retryAttempt < retryCount) {
        setTimeout(
          () => {
            fetchData(true, retryAttempt + 1);
          },
          retryDelay * (retryAttempt + 1),
        );
        return;
      }

      setError(err instanceof Error ? err : new Error("Unknown error"));
      setLoading(false);
    }
  };

  const preload = () => {
    const cached = getCachedData();
    if (cached) {
      setData(cached);
      return;
    }

    if (background) {
      // Background fetch without setting loading state
      fetchData(true);
    } else {
      fetchData();
    }
  };

  const refresh = () => {
    cacheRef.current.delete(key);
    fetchData();
  };

  const clearCache = () => {
    cacheRef.current.clear();
  };

  useEffect(() => {
    if (immediate) {
      preload();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [key]);

  return {
    data,
    loading,
    error,
    preload,
    refresh,
    clearCache,
    isCached: !!getCachedData(),
  };
}

// Hook untuk preloading multiple data
export function usePreloadMultiple<T>(
  dataMap: Record<string, () => Promise<T>>,
  options: PreloadOptions = {},
) {
  const [results, setResults] = useState<Record<string, T | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, Error | null>>({});

  const preloadAll = async () => {
    const keys = Object.keys(dataMap);
    const newLoading = { ...loading };
    const newErrors = { ...errors };

    keys.forEach((key) => {
      newLoading[key] = true;
      newErrors[key] = null;
    });

    setLoading(newLoading);

    try {
      const promises = keys.map(async (key) => {
        try {
          const data = await dataMap[key]();
          return { key, data, error: null };
        } catch (error) {
          return {
            key,
            data: null,
            error: error instanceof Error ? error : new Error("Unknown error"),
          };
        }
      });

      const results = await Promise.allSettled(promises);

      const newResults = { ...results };
      const finalLoading = { ...loading };
      const finalErrors = { ...errors };

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          const { key, data, error } = result.value;
          newResults[key] = data;
          finalLoading[key] = false;
          finalErrors[key] = error;
        }
      });

      setResults(newResults);
      setLoading(finalLoading);
      setErrors(finalErrors);
    } catch (error) {
      console.error("Error preloading multiple data:", error);
    }
  };

  useEffect(() => {
    if (options.immediate !== false) {
      preloadAll();
    }
  }, []);

  return {
    results,
    loading,
    errors,
    preloadAll,
    isLoading: Object.values(loading).some(Boolean),
    hasErrors: Object.values(errors).some(Boolean),
  };
}
