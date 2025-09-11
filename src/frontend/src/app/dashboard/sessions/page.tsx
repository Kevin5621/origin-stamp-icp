"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { SessionsSkeleton } from "@/components/ui/skeleton-loading";
import dynamic from "next/dynamic";

// Lazy load the sessions page component
const SessionsPage = dynamic(
  () =>
    import("@/components/pages/sessions/SessionsPage").then((mod) => ({
      default: mod.SessionsPage,
    })),
  {
    loading: () => <SessionsSkeleton />,
    ssr: false,
  },
);

export default function Sessions() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense fallback={<SessionsSkeleton />}>
          <SessionsPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
