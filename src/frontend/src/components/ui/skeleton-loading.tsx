import React from "react";
import { cn } from "@/lib/utils";

// Utility function to generate stable unique keys for skeleton items
// For skeleton components, we use a simple but unique identifier
const generateUniqueKey = (prefix: string, index: number): string => {
  // Using a combination that's stable across renders but unique
  return `${prefix}-skeleton-${index}`;
};

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("bg-muted/50 animate-pulse rounded-md", className)}
      {...props}
    />
  );
};

// Predefined skeleton components for common layouts
export const PageSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={generateUniqueKey("stat", i)}
            className="rounded-lg border p-6"
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="mb-1 h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={generateUniqueKey("card", i)}
              className="rounded-lg border p-4"
            >
              <Skeleton className="mb-4 h-48 w-full" />
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CollectionSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={generateUniqueKey("stat", i)}
            className="rounded-lg border p-6"
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="mb-1 h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="grid w-full grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>

        {/* NFT Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={generateUniqueKey("nft", i)}
              className="overflow-hidden rounded-lg border"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-3 p-4">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-16 w-full" />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SessionsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={generateUniqueKey("stat", i)}
            className="rounded-lg border p-6"
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="mb-1 h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="grid w-full grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>

        {/* Session Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={generateUniqueKey("session", i)}
              className="overflow-hidden rounded-lg border"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MarketplaceSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* NFT Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={generateUniqueKey("marketplace", i)}
            className="overflow-hidden rounded-lg border"
          >
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-3 p-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Profile Header */}
      <div className="rounded-lg border p-6">
        <div className="flex items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={generateUniqueKey("stat", i)}
            className="rounded-lg border p-6"
          >
            <Skeleton className="mb-2 h-8 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={generateUniqueKey("setting", i)}
            className="rounded-lg border p-6"
          >
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={generateUniqueKey(`setting-item-${i}`, j)}
                  className="flex items-center justify-between"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SessionRecordSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="border-border flex items-center gap-4 border-b pb-4">
          <Skeleton className="h-9 w-16" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Session Info - Spans 4 columns */}
          <div className="lg:col-span-4">
            <div className="border-primary/20 h-full rounded-lg border p-6 shadow-sm">
              <div className="border-border border-b pb-4">
                <Skeleton className="mb-2 h-6 w-40" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="space-y-6 pt-6">
                {/* Photos Progress */}
                <div className="from-primary/10 to-primary/5 rounded-lg bg-gradient-to-r p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="mb-1 h-8 w-16" />
                  <Skeleton className="mb-3 h-3 w-40" />
                  <Skeleton className="h-2 w-full" />
                </div>

                {/* Session Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <Skeleton className="mb-1 h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <Skeleton className="mb-1 h-3 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                {/* AI Verification Quick Status */}
                <div className="border-border rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Section - Spans 8 columns */}
          <div className="lg:col-span-8">
            <div className="border-primary/20 bg-primary/5 h-full rounded-lg border p-6 shadow-sm">
              <div className="border-border border-b pb-4">
                <Skeleton className="mb-2 h-6 w-32" />
                <Skeleton className="h-4 w-80" />
              </div>
              <div className="pt-6">
                <div className="bg-background/50 border-primary/20 mb-6 rounded-lg border p-4">
                  <Skeleton className="mb-3 h-4 w-32" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Photos Gallery */}
        <div className="rounded-lg border p-6 shadow-sm">
          <div className="border-border border-b pb-4">
            <Skeleton className="mb-2 h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="pt-6">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={generateUniqueKey("photo", i)}
                  className="group relative flex-shrink-0"
                >
                  <Skeleton className="h-32 w-24 rounded-lg" />
                  <Skeleton className="mt-2 h-3 w-16" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mt-2 h-2 w-full" />
          </div>
        </div>

        {/* AI Verification Section */}
        <div className="space-y-8">
          <div className="border-primary/20 bg-primary/5 rounded-lg border p-6 shadow-sm">
            <div className="border-border border-b pb-4">
              <Skeleton className="mb-2 h-6 w-48" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-background/50 rounded-lg p-4">
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="mb-1 h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <Skeleton className="mb-2 h-4 w-12" />
                  <Skeleton className="mb-2 h-6 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <Skeleton className="mb-2 h-4 w-28" />
                  <Skeleton className="mb-1 h-8 w-12" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
              <div className="border-border border-t pt-6">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
