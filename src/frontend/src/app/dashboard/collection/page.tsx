"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CollectionPage } from "@/components/pages/collection/CollectionPage";
import { DashboardGuard } from "@/components/auth/DashboardGuard";

export default function Collection() {
  return (
    <DashboardGuard>
      <MainLayout>
        <CollectionPage />
      </MainLayout>
    </DashboardGuard>
  );
}
