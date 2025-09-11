import React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerSidebar } from "./CustomerSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
}) => {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
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
        return "Dashboard";
    }
  };

  React.useEffect(() => {
    const title = getPageTitle(pathname);
    document.title = `${title} - OriginStamp`;
  }, [pathname]);

  return (
    <SidebarProvider>
      <div
        className={`bg-background flex min-h-screen w-full ${className || ""}`}
      >
        <CustomerSidebar activeSection={pathname} />

        <SidebarInset className="min-w-0 flex-1">
          <CustomerHeader />

          <main className="w-full flex-1 overflow-auto">
            <div className="h-full w-full max-w-none px-6 py-6">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
