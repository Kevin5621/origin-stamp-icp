"use client";

import { useEffect, useState } from "react";

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "paint") {
          if (entry.name === "first-contentful-paint") {
            setMetrics((prev) => ({ ...prev, fcp: entry.startTime }));
          }
        }

        if (entry.entryType === "largest-contentful-paint") {
          setMetrics((prev) => ({ ...prev, lcp: entry.startTime }));
        }

        if (entry.entryType === "first-input") {
          const firstInputEntry = entry as PerformanceEntry & {
            processingStart: number;
          };
          setMetrics((prev) => ({
            ...prev,
            fid: firstInputEntry.processingStart - firstInputEntry.startTime,
          }));
        }

        if (entry.entryType === "layout-shift") {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          if (!layoutShiftEntry.hadRecentInput) {
            setMetrics((prev) => ({
              ...prev,
              cls: (prev.cls || 0) + layoutShiftEntry.value,
            }));
          }
        }
      }
    });

    // Observe different performance entry types
    observer.observe({
      entryTypes: [
        "paint",
        "largest-contentful-paint",
        "first-input",
        "layout-shift",
      ],
    });

    // Get TTFB
    const navigationEntry = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics((prev) => ({
        ...prev,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
      }));
    }

    // Show performance monitor after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible || process.env.NODE_ENV !== "development") {
    return null;
  }

  const getScoreColor = (
    value: number,
    thresholds: { good: number; poor: number },
  ) => {
    if (value <= thresholds.good) return "text-green-500";
    if (value <= thresholds.poor) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-xs rounded-lg bg-black/80 p-4 font-mono text-xs text-white">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold">Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-1">
        {metrics.fcp && (
          <div className="flex justify-between">
            <span>FCP:</span>
            <span
              className={getScoreColor(metrics.fcp, { good: 1800, poor: 3000 })}
            >
              {metrics.fcp.toFixed(0)}ms
            </span>
          </div>
        )}

        {metrics.lcp && (
          <div className="flex justify-between">
            <span>LCP:</span>
            <span
              className={getScoreColor(metrics.lcp, { good: 2500, poor: 4000 })}
            >
              {metrics.lcp.toFixed(0)}ms
            </span>
          </div>
        )}

        {metrics.fid && (
          <div className="flex justify-between">
            <span>FID:</span>
            <span
              className={getScoreColor(metrics.fid, { good: 100, poor: 300 })}
            >
              {metrics.fid.toFixed(0)}ms
            </span>
          </div>
        )}

        {metrics.cls && (
          <div className="flex justify-between">
            <span>CLS:</span>
            <span
              className={getScoreColor(metrics.cls, { good: 0.1, poor: 0.25 })}
            >
              {metrics.cls.toFixed(3)}
            </span>
          </div>
        )}

        {metrics.ttfb && (
          <div className="flex justify-between">
            <span>TTFB:</span>
            <span
              className={getScoreColor(metrics.ttfb, { good: 800, poor: 1800 })}
            >
              {metrics.ttfb.toFixed(0)}ms
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 border-t border-gray-600 pt-2 text-xs text-gray-400">
        <div>Green: Good | Yellow: Needs Improvement | Red: Poor</div>
      </div>
    </div>
  );
};
