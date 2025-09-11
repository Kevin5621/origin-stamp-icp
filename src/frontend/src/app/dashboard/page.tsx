"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { PageSkeleton } from "@/components/ui/skeleton-loading";
import dynamic from "next/dynamic";

// Lazy load the dashboard page component
const DashboardPage = dynamic(
  () =>
    import("@/components/pages/dashboard/DashboardPage").then((mod) => ({
      default: mod.DashboardPage,
    })),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

export default function Dashboard() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense fallback={<PageSkeleton />}>
          <DashboardPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
