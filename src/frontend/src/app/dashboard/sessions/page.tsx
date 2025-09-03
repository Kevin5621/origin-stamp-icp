"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SessionsPage } from "@/components/pages/sessions/SessionsPage";
import { DashboardGuard } from "@/components/auth/DashboardGuard";

export default function Sessions() {
  return (
    <DashboardGuard>
      <MainLayout>
        <SessionsPage />
      </MainLayout>
    </DashboardGuard>
  );
}
