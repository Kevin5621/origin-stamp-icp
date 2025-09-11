"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";

interface IntelligentPreloaderProps {
  children: React.ReactNode;
  route: string;
  preloadOnHover?: boolean;
  preloadOnFocus?: boolean;
  preloadDelay?: number;
}

export const IntelligentPreloader: React.FC<IntelligentPreloaderProps> = ({
  children,
  route,
  preloadOnHover = true,
  preloadOnFocus = true,
  preloadDelay = 100,
}) => {
  const router = useRouter();
  const preloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasPreloadedRef = useRef(false);

  const preloadRoute = useCallback(() => {
    if (hasPreloadedRef.current) return;

    preloadTimeoutRef.current = setTimeout(() => {
      router.prefetch(route);
      hasPreloadedRef.current = true;
    }, preloadDelay);
  }, [router, route, preloadDelay]);

  const cancelPreload = useCallback(() => {
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
      preloadTimeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (preloadOnHover) {
      preloadRoute();
    }
  }, [preloadOnHover, preloadRoute]);

  const handleMouseLeave = useCallback(() => {
    if (preloadOnHover) {
      cancelPreload();
    }
  }, [preloadOnHover, cancelPreload]);

  const handleFocus = useCallback(() => {
    if (preloadOnFocus) {
      preloadRoute();
    }
  }, [preloadOnFocus, preloadRoute]);

  const handleBlur = useCallback(() => {
    if (preloadOnFocus) {
      cancelPreload();
    }
  }, [preloadOnFocus, cancelPreload]);

  useEffect(() => {
    return () => {
      cancelPreload();
    };
  }, [cancelPreload]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </div>
  );
};

// Hook untuk intelligent preloading
export const useIntelligentPreloading = () => {
  const router = useRouter();

  const preloadOnHover = useCallback(
    (route: string, delay = 100) => {
      setTimeout(() => {
        router.prefetch(route);
      }, delay);
    },
    [router],
  );

  const preloadOnFocus = useCallback(
    (route: string, delay = 50) => {
      setTimeout(() => {
        router.prefetch(route);
      }, delay);
    },
    [router],
  );

  const preloadCriticalRoutes = useCallback(
    (routes: string[]) => {
      routes.forEach((route) => {
        router.prefetch(route);
      });
    },
    [router],
  );

  return {
    preloadOnHover,
    preloadOnFocus,
    preloadCriticalRoutes,
  };
};

// Component untuk preload critical routes saat idle
export const CriticalRoutePreloader: React.FC<{
  routes: string[];
  preloadOnIdle?: boolean;
}> = ({ routes, preloadOnIdle = true }) => {
  const { preloadCriticalRoutes } = useIntelligentPreloading();

  useEffect(() => {
    if (!preloadOnIdle) return;

    const preloadOnIdleCallback = () => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        requestIdleCallback(() => {
          preloadCriticalRoutes(routes);
        });
      } else {
        // Fallback untuk browser yang tidak support requestIdleCallback
        setTimeout(() => {
          preloadCriticalRoutes(routes);
        }, 2000);
      }
    };

    // Preload setelah 3 detik idle
    const timeoutId = setTimeout(preloadOnIdleCallback, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [routes, preloadCriticalRoutes, preloadOnIdle]);

  return null;
};
