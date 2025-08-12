import { useEffect, useRef, useState, useCallback } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {},
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<T>(null);

  const { threshold = 0.1, rootMargin = "0px", root = null } = options;

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const isIntersecting = entry.isIntersecting;

      setIsIntersecting(isIntersecting);

      if (isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    },
    [hasIntersected],
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleIntersection, threshold, rootMargin, root]);

  return {
    elementRef,
    isIntersecting,
    hasIntersected,
  };
}

// Hook untuk lazy loading dengan intersection observer
export function useLazyLoad<T extends Element>(
  options: UseIntersectionObserverOptions = {},
) {
  const { elementRef, isIntersecting, hasIntersected } =
    useIntersectionObserver<T>(options);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, shouldLoad]);

  return {
    elementRef,
    shouldLoad,
    hasIntersected,
  };
}

// Hook untuk infinite scroll
export function useInfiniteScroll<T extends Element>(
  onLoadMore: () => void,
  options: UseIntersectionObserverOptions = {},
) {
  const { elementRef, isIntersecting } = useIntersectionObserver<T>(options);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isIntersecting && !isLoading) {
      setIsLoading(true);
      onLoadMore().finally(() => {
        setIsLoading(false);
      });
    }
  }, [isIntersecting, isLoading, onLoadMore]);

  return {
    elementRef,
    isLoading,
  };
}
