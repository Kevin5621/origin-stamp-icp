"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { SessionRecordSkeleton } from "@/components/ui/skeleton-loading";
import dynamic from "next/dynamic";

// Lazy load the session record page component (heavy component with 770 lines)
const SessionRecordPage = dynamic(
  () =>
    import("@/components/pages/sessions/SessionRecordPage").then((mod) => ({
      default: mod.SessionRecordPage,
    })),
  {
    loading: () => <SessionRecordSkeleton />,
    ssr: false,
  },
);

export default function SessionRecord() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense fallback={<SessionRecordSkeleton />}>
          <SessionRecordPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
