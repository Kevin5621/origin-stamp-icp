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

  const getSectionTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/sessions":
        return "My Art Sessions";
      case "/dashboard/marketplace":
        return "Marketplace";
      case "/dashboard/collection":
        return "My Collection";
      case "/dashboard/profile":
        return "My Profile";
      default:
        return "Dashboard";
    }
  };

  const getSectionSubtitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Welcome back! Here's your art journey overview.";
      case "/dashboard/sessions":
        return "Manage your physical art sessions and certificates.";
      case "/dashboard/marketplace":
        return "Discover and collect unique NFT artworks.";
      case "/dashboard/collection":
        return "View your collected NFTs and certificates.";
      case "/dashboard/profile":
        return "Manage your account and preferences.";
      default:
        return "";
    }
  };

  return (
    <SidebarProvider>
      <div
        className={`bg-background flex min-h-screen w-full ${className || ""}`}
      >
        <CustomerSidebar activeSection={pathname} />

        <SidebarInset className="min-w-0 flex-1">
          <CustomerHeader
            title={getSectionTitle(pathname)}
            subtitle={getSectionSubtitle(pathname)}
          />

          <main className="w-full flex-1 overflow-auto">
            <div className="h-full w-full max-w-none px-6 py-6">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
