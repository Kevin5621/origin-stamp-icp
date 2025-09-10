"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import dynamic from "next/dynamic";

// Lazy load the collection page component (heavy component with 698 lines)
const CollectionPage = dynamic(
  () =>
    import("@/components/pages/collection/CollectionPage").then((mod) => ({
      default: mod.CollectionPage,
    })),
  {
    loading: () => (
      <div className="flex min-h-[600px] items-center justify-center">
        <LoadingSpinner size="lg" variant="infinite" />
      </div>
    ),
    ssr: false,
  },
);

export default function Collection() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense
          fallback={
            <div className="flex min-h-[600px] items-center justify-center">
              <LoadingSpinner size="lg" variant="infinite" />
            </div>
          }
        >
          <CollectionPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
