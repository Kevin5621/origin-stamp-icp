"use client";

import { useState, useCallback } from "react";
import { type PhysicalArtSession } from "@/services";

interface SessionCache {
  sessions: PhysicalArtSession[];
  lastFetch: number;
  username: string;
}

interface UseSessionCacheReturn {
  getCachedSessions: (username: string) => PhysicalArtSession[] | null;
  setCachedSessions: (username: string, sessions: PhysicalArtSession[]) => void;
  invalidateCache: (username?: string) => void;
  isCacheValid: (username: string, maxAge?: number) => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const sessionCache = new Map<string, SessionCache>();

export const useSessionCache = (): UseSessionCacheReturn => {
  const getCachedSessions = useCallback(
    (username: string): PhysicalArtSession[] | null => {
      const cached = sessionCache.get(username);
      if (!cached) return null;

      const isExpired = Date.now() - cached.lastFetch > CACHE_DURATION;
      if (isExpired) {
        sessionCache.delete(username);
        return null;
      }

      return cached.sessions;
    },
    [],
  );

  const setCachedSessions = useCallback(
    (username: string, sessions: PhysicalArtSession[]) => {
      sessionCache.set(username, {
        sessions,
        lastFetch: Date.now(),
        username,
      });
    },
    [],
  );

  const invalidateCache = useCallback((username?: string) => {
    if (username) {
      sessionCache.delete(username);
    } else {
      sessionCache.clear();
    }
  }, []);

  const isCacheValid = useCallback(
    (username: string, maxAge: number = CACHE_DURATION): boolean => {
      const cached = sessionCache.get(username);
      if (!cached) return false;

      return Date.now() - cached.lastFetch < maxAge;
    },
    [],
  );

  return {
    getCachedSessions,
    setCachedSessions,
    invalidateCache,
    isCacheValid,
  };
};

// Hook for optimistic updates
export const useOptimisticSessions = () => {
  const [optimisticSessions, setOptimisticSessions] = useState<
    PhysicalArtSession[]
  >([]);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const addOptimisticSession = useCallback((newSession: PhysicalArtSession) => {
    setOptimisticSessions((prev) => [newSession, ...prev]);
    setIsOptimistic(true);
  }, []);

  const removeOptimisticSession = useCallback(
    (sessionId: string) => {
      setOptimisticSessions((prev) =>
        prev.filter((s) => s.session_id !== sessionId),
      );
      setIsOptimistic(optimisticSessions.length > 1);
    },
    [optimisticSessions.length],
  );

  const clearOptimisticSessions = useCallback(() => {
    setOptimisticSessions([]);
    setIsOptimistic(false);
  }, []);

  return {
    optimisticSessions,
    isOptimistic,
    addOptimisticSession,
    removeOptimisticSession,
    clearOptimisticSessions,
  };
};
