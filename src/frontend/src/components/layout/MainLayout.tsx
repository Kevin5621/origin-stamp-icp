import React, { memo, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerSidebar } from "./CustomerSidebar";

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

    // Memoize page title to prevent recalculation
    const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

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

    return (
      <SidebarProvider>
        <div className={layoutClasses}>
          <MemoizedCustomerSidebar activeSection={pathname} />

          <SidebarInset className="min-w-0 flex-1">
            <MemoizedCustomerHeader />

            <main className="w-full flex-1 overflow-auto">
              <div className="h-full w-full max-w-none px-6 py-6">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  },
);

MainLayout.displayName = "MainLayout";
