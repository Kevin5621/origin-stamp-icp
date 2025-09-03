"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MarketplacePage } from "@/components/pages/marketplace/MarketplacePage";
import { DashboardGuard } from "@/components/auth/DashboardGuard";

export default function Marketplace() {
  return (
    <DashboardGuard>
      <MainLayout>
        <MarketplacePage />
      </MainLayout>
    </DashboardGuard>
  );
}
