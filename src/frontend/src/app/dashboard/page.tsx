"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import dynamic from "next/dynamic";

// Lazy load the dashboard page component
const DashboardPage = dynamic(
  () =>
    import("@/components/pages/dashboard/DashboardPage").then((mod) => ({
      default: mod.DashboardPage,
    })),
  {
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" variant="infinite" />
      </div>
    ),
    ssr: false,
  },
);

export default function Dashboard() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <LoadingSpinner size="lg" variant="infinite" />
            </div>
          }
        >
          <DashboardPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
