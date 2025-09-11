"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { MarketplaceSkeleton } from "@/components/ui/skeleton-loading";
import dynamic from "next/dynamic";

// Lazy load the marketplace page component
const MarketplacePage = dynamic(
  () =>
    import("@/components/pages/marketplace/MarketplacePage").then((mod) => ({
      default: mod.MarketplacePage,
    })),
  {
    loading: () => <MarketplaceSkeleton />,
    ssr: false,
  },
);

export default function Marketplace() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense fallback={<MarketplaceSkeleton />}>
          <MarketplacePage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
