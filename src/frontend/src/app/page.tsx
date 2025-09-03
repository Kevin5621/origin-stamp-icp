import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { HeroSection } from "@/components/sections/HeroSection";
import { CreatorsSection } from "@/components/sections/CreatorsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
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
        <CreatorsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
