"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CriticalRoutePreloader } from "./IntelligentPreloader";

interface ResourcePreloaderProps {
  preloadRoutes?: string[];
  preloadImages?: string[];
  enableIntelligentPreloading?: boolean;
}

export const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({
  preloadRoutes = [],
  preloadImages = [],
  enableIntelligentPreloading = true,
}) => {
  const router = useRouter();

  useEffect(() => {
    // Preload critical routes immediately
    preloadRoutes.forEach((route) => {
      router.prefetch(route);
    });

    // Preload critical images
    preloadImages.forEach((imageSrc) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = imageSrc;
      document.head.appendChild(link);
    });

    // Font preloading is handled by Next.js font optimization
    // No need to manually preload fonts

    // Cleanup function
    return () => {
      // Remove preloaded images
      preloadImages.forEach((imageSrc) => {
        const existingLink = document.querySelector(`link[href="${imageSrc}"]`);
        if (existingLink) {
          document.head.removeChild(existingLink);
        }
      });

      // Font cleanup not needed as Next.js handles font optimization
    };
  }, [preloadRoutes, preloadImages, router]);

  return (
    <>
      {enableIntelligentPreloading && (
        <CriticalRoutePreloader routes={preloadRoutes} />
      )}
    </>
  );
};

// Hook for intelligent preloading based on user behavior
export const useIntelligentPreloading = () => {
  const router = useRouter();

  const preloadOnHover = (route: string, delay = 100) => {
    setTimeout(() => {
      router.prefetch(route);
    }, delay);
  };

  const preloadOnFocus = (route: string, delay = 50) => {
    setTimeout(() => {
      router.prefetch(route);
    }, delay);
  };

  const preloadCriticalRoutes = (routes: string[]) => {
    routes.forEach((route) => {
      router.prefetch(route);
    });
  };

  return {
    preloadOnHover,
    preloadOnFocus,
    preloadCriticalRoutes,
  };
};
