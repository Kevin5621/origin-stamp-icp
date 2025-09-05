import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { SubscriptionSection } from "@/components/sections/SubscriptionSection";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "OriginStamp - Home",
  description: "Decentralized NFT marketplace for physical art authentication",
};

export default function Home() {
  return (
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
  );
}
