"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import dynamic from "next/dynamic";

// Lazy load the session record page component (heavy component with 770 lines)
const SessionRecordPage = dynamic(
  () =>
    import("@/components/pages/sessions/SessionRecordPage").then((mod) => ({
      default: mod.SessionRecordPage,
    })),
  {
    loading: () => (
      <div className="flex min-h-[700px] items-center justify-center">
        <LoadingSpinner size="lg" variant="infinite" />
      </div>
    ),
    ssr: false,
  },
);

export default function SessionRecord() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense
          fallback={
            <div className="flex min-h-[700px] items-center justify-center">
              <LoadingSpinner size="lg" variant="infinite" />
            </div>
          }
        >
          <SessionRecordPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
