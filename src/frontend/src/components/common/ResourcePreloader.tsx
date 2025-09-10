"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ResourcePreloaderProps {
  preloadRoutes?: string[];
  preloadImages?: string[];
}

export const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({
  preloadRoutes = [],
  preloadImages = [],
}) => {
  const router = useRouter();

  useEffect(() => {
    // Preload critical routes
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

    // Preload critical fonts
    const fontPreloads = [
      "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap",
      "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap",
    ];

    fontPreloads.forEach((fontUrl) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = fontUrl;
      document.head.appendChild(link);
    });

    // Cleanup function
    return () => {
      // Remove preloaded images
      preloadImages.forEach((imageSrc) => {
        const existingLink = document.querySelector(`link[href="${imageSrc}"]`);
        if (existingLink) {
          document.head.removeChild(existingLink);
        }
      });

      // Remove preloaded fonts
      fontPreloads.forEach((fontUrl) => {
        const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
        if (existingLink) {
          document.head.removeChild(existingLink);
        }
      });
    };
  }, [preloadRoutes, preloadImages, router]);

  return null;
};

// Hook for intelligent preloading based on user behavior
export const useIntelligentPreloading = () => {
  const router = useRouter();

  const preloadOnHover = (route: string) => {
    router.prefetch(route);
  };

  const preloadOnFocus = (route: string) => {
    router.prefetch(route);
  };

  return {
    preloadOnHover,
    preloadOnFocus,
  };
};
