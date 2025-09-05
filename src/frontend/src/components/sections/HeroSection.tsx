"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { backendService } from "@/services/backendService";

export function HeroSection() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    backendService.getMarketplaceStats();

    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateCertificate = () => {
    router.push("/dashboard/marketplace");
  };

  return (
    <section className="relative sticky top-0 z-30 -mt-16 flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Background Image Container dengan Natural Fade */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <Image
            src="/landing/hero.webp"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
            }}
          />
        </div>
        {/* Overlay untuk kontras teks - dikurangi opacity */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1
            className="text-5xl leading-tight font-light text-white drop-shadow-lg md:text-7xl lg:text-8xl"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            Beyond Authenticity.{" "}
            <span className="text-primary font-medium">
              Verifiable Provenance.
            </span>
          </h1>

          <p
            className="mx-auto max-w-2xl text-xl leading-relaxed text-white/90 drop-shadow-md md:text-2xl"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
            }}
          >
            In the age of AI, prove your process. OriginStamp provides an
            immutable on-chain history for your work, creating the new standard
            for digital trust.
          </p>

          <div
            className="flex justify-center pt-8"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
            }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg font-medium shadow-lg transition-shadow hover:shadow-xl"
              onClick={handleCreateCertificate}
            >
              Discover Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
