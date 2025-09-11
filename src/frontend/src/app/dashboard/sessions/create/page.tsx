"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { PageSkeleton } from "@/components/ui/skeleton-loading";
import dynamic from "next/dynamic";

// Lazy load the create session page component
const CreateSessionPage = dynamic(
  () =>
    import("@/components/pages/sessions/CreateSessionPage").then((mod) => ({
      default: mod.CreateSessionPage,
    })),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

export default function CreateSession() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense fallback={<PageSkeleton />}>
          <CreateSessionPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
