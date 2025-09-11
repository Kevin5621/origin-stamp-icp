"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { PageSkeleton } from "@/components/ui/skeleton-loading";
import dynamic from "next/dynamic";

// Lazy load the subscription page component
const SubscriptionPage = dynamic(
  () =>
    import("@/components/pages/subscription/SubscriptionPage").then((mod) => ({
      default: mod.SubscriptionPage,
    })),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

export default function Subscription() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense fallback={<PageSkeleton />}>
          <SubscriptionPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
