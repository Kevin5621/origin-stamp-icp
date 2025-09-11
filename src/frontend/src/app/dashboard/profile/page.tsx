"use client";

import React, { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";
import { ProfileSkeleton } from "@/components/ui/skeleton-loading";
import dynamic from "next/dynamic";

// Lazy load the profile page component
const ProfilePage = dynamic(
  () =>
    import("@/components/pages/profile/ProfilePage").then((mod) => ({
      default: mod.ProfilePage,
    })),
  {
    loading: () => <ProfileSkeleton />,
    ssr: false,
  },
);

export default function Profile() {
  return (
    <DashboardGuard>
      <MainLayout>
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfilePage />
        </Suspense>
      </MainLayout>
    </DashboardGuard>
  );
}
