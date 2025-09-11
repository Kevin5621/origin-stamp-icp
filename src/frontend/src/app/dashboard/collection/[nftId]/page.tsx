"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { PageSkeleton } from "@/components/ui/skeleton-loading";
import dynamic from "next/dynamic";

// Lazy load the NFT detail page component
const NFTDetailPage = dynamic(
  () =>
    import("@/components/pages/collection/NFTDetailPage").then((mod) => ({
      default: mod.NFTDetailPage,
    })),
  {
    loading: () => <PageSkeleton />,
    ssr: false,
  },
);

export default function NFTDetailRoute() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense fallback={<PageSkeleton />}>
          <NFTDetailPage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
