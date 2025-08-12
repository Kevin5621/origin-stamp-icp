import React, { useEffect, useRef } from "react";
import { useLazyLoad } from "../../hooks/useIntersectionObserver";

interface RoutePreloaderProps {
  route: string;
  onPreload: () => void;
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export const RoutePreloader: React.FC<RoutePreloaderProps> = ({
  route,
  onPreload,
  children,
  threshold = 0.1,
  rootMargin = "100px",
}) => {
  const { elementRef, shouldLoad } = useLazyLoad<HTMLDivElement>({
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (shouldLoad) {
      console.log(`Preloading route: ${route}`);
      onPreload();
    }
  }, [shouldLoad, route, onPreload]);

  return <div ref={elementRef}>{children}</div>;
};

export default RoutePreloader;
