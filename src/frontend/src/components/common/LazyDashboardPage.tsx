import React, { Suspense, lazy, ComponentType } from "react";
import { DashboardLoader } from "./DashboardLoader";

interface LazyDashboardPageProps {
  component: ComponentType<any>;
  fallback?: React.ReactNode;
  loadingMessage?: string;
  loadingVariant?: "skeleton" | "spinner" | "dots";
}

export const LazyDashboardPage: React.FC<LazyDashboardPageProps> = ({
  component: Component,
  fallback,
  loadingMessage = "Memuat halaman...",
  loadingVariant = "skeleton",
}) => {
  const defaultFallback = (
    <DashboardLoader message={loadingMessage} variant={loadingVariant} />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <Component />
    </Suspense>
  );
};

// Factory function untuk membuat lazy components
export function createLazyDashboardPage<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loadingMessage?: string;
    loadingVariant?: "skeleton" | "spinner" | "dots";
  },
) {
  const LazyComponent = lazy(importFn);

  return function LazyPage(props: React.ComponentProps<T>) {
    return (
      <Suspense
        fallback={
          <DashboardLoader
            message={options?.loadingMessage || "Memuat halaman..."}
            variant={options?.loadingVariant || "skeleton"}
          />
        }
      >
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export default LazyDashboardPage;
