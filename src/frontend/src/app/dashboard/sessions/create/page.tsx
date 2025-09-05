"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CreateSessionPage } from "@/components/pages/sessions/CreateSessionPage";
import { DashboardGuard } from "@/components/auth/DashboardGuard";

export default function CreateSession() {
  return (
    <DashboardGuard>
      <MainLayout>
        <CreateSessionPage />
      </MainLayout>
    </DashboardGuard>
  );
}
