import React, { memo, useMemo, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerSidebar } from "./CustomerSidebar";
import { TrendingSidebar } from "@/components/pages/marketplace/components/TrendingSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// Memoized page title getter to prevent recalculation
const getPageTitle = (path: string): string => {
  switch (path) {
    case "/dashboard":
      return "Dashboard";
    case "/dashboard/sessions":
      return "My Art Sessions";
    case "/dashboard/sessions/create":
      return "Create Art Session";
    case "/dashboard/marketplace":
      return "Marketplace";
    case "/dashboard/collection":
      return "My Collection";
    case "/dashboard/profile":
      return "My Profile";
    case "/dashboard/subscription":
      return "Subscription Management";
    default:
      // Handle dynamic routes like /dashboard/sessions/[sessionId]
      if (
        path.startsWith("/dashboard/sessions/") &&
        path !== "/dashboard/sessions/create"
      ) {
        return "Art Session Details";
      }
      if (path.startsWith("/dashboard/collection/")) {
        return "NFT Details";
      }
      return "Dashboard";
  }
};

// Memoized sidebar component to prevent re-renders
const MemoizedCustomerSidebar = memo(CustomerSidebar);

// Memoized header component to prevent re-renders
const MemoizedCustomerHeader = memo(CustomerHeader);

export const MainLayout: React.FC<MainLayoutProps> = memo(
  ({ children, className }) => {
    const pathname = usePathname();
    const [trendingSidebarCollapsed, setTrendingSidebarCollapsed] =
      useState(false);

    // Memoize page title to prevent recalculation
    const pageTitle = useMemo(() => getPageTitle(pathname || "/"), [pathname]);

    // Memoize document title update
    const updateDocumentTitle = useCallback(() => {
      document.title = `${pageTitle} - OriginStamp`;
    }, [pageTitle]);

    React.useEffect(() => {
      updateDocumentTitle();
    }, [updateDocumentTitle]);

    // Memoize layout classes
    const layoutClasses = useMemo(
      () => `bg-background flex min-h-screen w-full ${className || ""}`,
      [className],
    );

    // Check if we're on marketplace page
    const isMarketplacePage = pathname === "/dashboard/marketplace";

    return (
      <SidebarProvider>
        <div className={layoutClasses}>
          <MemoizedCustomerSidebar activeSection={pathname || "/"} />

          <SidebarInset className="flex min-w-0 flex-1 flex-col">
            <MemoizedCustomerHeader />

            <div className="flex min-h-0 flex-1">
              <main className="w-full flex-1 overflow-auto">
                <div className="min-h-full w-full max-w-none px-6 py-6">
                  {children}
                </div>
              </main>

              {/* Trending Sidebar - Only show on marketplace page */}
              {isMarketplacePage && (
                <div
                  className={`hidden transition-all duration-300 xl:block ${
                    trendingSidebarCollapsed ? "w-16" : "w-80"
                  } flex-shrink-0`}
                >
                  <div className="bg-background border-border sticky top-16 z-10 flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex-col border-l">
                    {/* Expand Button - Only show when collapsed */}
                    {trendingSidebarCollapsed && (
                      <div className="border-border border-b p-2">
                        <button
                          onClick={() => setTrendingSidebarCollapsed(false)}
                          className="hover:bg-muted flex h-8 w-full items-center justify-center rounded transition-colors"
                          title="Expand sidebar"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                      <div
                        className={`p-4 transition-opacity duration-300 ${
                          trendingSidebarCollapsed
                            ? "pointer-events-none opacity-0"
                            : "opacity-100"
                        }`}
                      >
                        <TrendingSidebar
                          onCollapse={() =>
                            setTrendingSidebarCollapsed(
                              !trendingSidebarCollapsed,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  },
);

MainLayout.displayName = "MainLayout";
