"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { CollectionSkeleton } from "@/components/ui/skeleton-loading";
import dynamic from "next/dynamic";

// Lazy load the collection page component with optimized loading
const CollectionPage = dynamic(
  () =>
    import("@/components/pages/collection/CollectionPage").then((mod) => ({
      default: mod.CollectionPage,
    })),
  {
    loading: () => <CollectionSkeleton />,
    ssr: false,
  },
);

export default function Collection() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense fallback={<CollectionSkeleton />}>
          <CollectionPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
