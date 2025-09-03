"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";

export default function DashboardPage() {
  return (
    <DashboardGuard>
      <DashboardLayout />
    </DashboardGuard>
  );
}
