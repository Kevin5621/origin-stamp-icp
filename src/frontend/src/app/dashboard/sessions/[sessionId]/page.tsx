"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SessionRecordPage } from "@/components/pages/sessions/SessionRecordPage";
import { DashboardGuard } from "@/components/auth/DashboardGuard";

export default function SessionRecord() {
  return (
    <DashboardGuard>
      <MainLayout>
        <SessionRecordPage />
      </MainLayout>
    </DashboardGuard>
  );
}
