"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SubscriptionPage } from "@/components/pages/subscription/SubscriptionPage";
import { DashboardGuard } from "@/components/auth/DashboardGuard";

export default function Subscription() {
  return (
    <DashboardGuard>
      <MainLayout>
        <SubscriptionPage />
      </MainLayout>
    </DashboardGuard>
  );
}
