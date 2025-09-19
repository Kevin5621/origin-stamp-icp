import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import crypto polyfill early
import "@/utils/crypto-polyfill";

import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import ToastContainer from "@/components/ui/toast-container";
import { CookieSync } from "../components/auth/CookieSync";
import { ResourcePreloader } from "@/components/common/ResourcePreloader";
import { GoogleOAuthLoader } from "@/components/auth/GoogleOAuthLoader";

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
          <GoogleOAuthLoader>
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
                      "/dashboard/subscription",
                      "/dashboard/sessions/create",
                    ]}
                    preloadImages={[
                      "/landing/hero.webp",
                      "/landing/blockchain-authenticatio.webp",
                      "/landing/instant-verification.webp",
                    ]}
                    enableIntelligentPreloading={true}
                  />
                  {children}
                  <ToastContainer />
                </ToastProvider>
              </SubscriptionProvider>
            </AuthProvider>
          </GoogleOAuthLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
