import { useCallback, useRef } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  maxSize?: number; // Maximum cache size
}

export function useApiCache<T = unknown>(options: CacheOptions = {}) {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options; // Default 5 minutes TTL
  const cache = useRef<Map<string, CacheEntry<T>>>(new Map());

  const get = useCallback((key: string): T | null => {
    const entry = cache.current.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const set = useCallback(
    (key: string, data: T, customTtl?: number): void => {
      // Remove oldest entries if cache is full
      if (cache.current.size >= maxSize) {
        const firstKey = cache.current.keys().next().value;
        if (firstKey) {
          cache.current.delete(firstKey);
        }
      }

      cache.current.set(key, {
        data,
        timestamp: Date.now(),
        ttl: customTtl || ttl,
      });
    },
    [ttl, maxSize],
  );

  const invalidate = useCallback((key: string): void => {
    cache.current.delete(key);
  }, []);

  const clear = useCallback((): void => {
    cache.current.clear();
  }, []);

  const has = useCallback((key: string): boolean => {
    const entry = cache.current.get(key);
    if (!entry) return false;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return false;
    }

    return true;
  }, []);

  return {
    get,
    set,
    invalidate,
    clear,
    has,
    size: cache.current.size,
  };
}

// Hook for cached API calls
export function useCachedApiCall<T>(
  apiCall: () => Promise<T>,
  cacheKey: string,
  options: CacheOptions & { enabled?: boolean } = {},
) {
  const { enabled = true, ...cacheOptions } = options;
  const cache = useApiCache<T>(cacheOptions);

  const execute = useCallback(async (): Promise<T> => {
    if (!enabled) {
      return apiCall();
    }

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData !== null) {
      return cachedData;
    }

    // Make API call and cache result
    try {
      const data = await apiCall();
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      throw error;
    }
  }, [apiCall, cacheKey, cache, enabled]);

  const invalidate = useCallback(() => {
    cache.invalidate(cacheKey);
  }, [cache, cacheKey]);

  return {
    execute,
    invalidate,
    isCached: cache.has(cacheKey),
  };
}
