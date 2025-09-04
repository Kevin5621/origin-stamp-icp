import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import ToastContainer from "@/components/ui/toast-container";
import { CookieSync } from "../components/auth/CookieSync";

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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SubscriptionProvider>
              <ToastProvider>
                <CookieSync />
                {children}
                <ToastContainer />
              </ToastProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
