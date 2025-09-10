import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import ToastContainer from "@/components/ui/toast-container";
import { CookieSync } from "../components/auth/CookieSync";
import { ResourcePreloader } from "@/components/common/ResourcePreloader";
import { PerformanceMonitor } from "@/components/common/PerformanceMonitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OriginStamp - NFT Marketplace",
  description: "Decentralized NFT marketplace for physical art authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SubscriptionProvider>
              <ToastProvider>
                <CookieSync />
                <ResourcePreloader
                  preloadRoutes={[
                    "/dashboard",
                    "/dashboard/collection",
                    "/dashboard/marketplace",
                    "/dashboard/sessions",
                    "/dashboard/profile",
                  ]}
                  preloadImages={[
                    "/landing/hero.webp",
                    "/landing/blockchain-authenticatio.webp",
                    "/landing/instant-verification.webp",
                  ]}
                />
                {children}
                <ToastContainer />
                <PerformanceMonitor />
              </ToastProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
