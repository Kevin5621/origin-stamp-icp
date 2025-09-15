"use client";

import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { SubscriptionSection } from "@/components/sections/SubscriptionSection";
import { Footer } from "@/components/layout/Footer";
import { AuthRedirect } from "@/components/auth/AuthRedirect";

export default function Home() {
  return (
    <AuthRedirect>
      <div className="bg-background min-h-screen">
        <NavigationHeader />
        <main>
          <HeroSection />
          <div className="relative z-40">
            <FeaturesSection />
          </div>
          <div className="relative z-40">
            <SubscriptionSection />
          </div>
        </main>
        <div className="relative z-40">
          <Footer />
        </div>
      </div>
    </AuthRedirect>
  );
}
