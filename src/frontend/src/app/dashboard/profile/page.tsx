"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfilePage } from "@/components/pages/profile/ProfilePage";
import { DashboardGuard } from "@/components/auth/DashboardGuard";

export default function Profile() {
  return (
    <DashboardGuard>
      <MainLayout>
        <ProfilePage />
      </MainLayout>
    </DashboardGuard>
  );
}
