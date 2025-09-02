"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Upload, ShoppingCart, Trophy } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description:
        "Connect your crypto wallet to start trading NFTs on our secure blockchain platform.",
      step: "01",
    },
    {
      icon: Upload,
      title: "Create & Verify",
      description:
        "Upload your physical artwork and create certificates with our blockchain authentication tools.",
      step: "02",
    },
    {
      icon: ShoppingCart,
      title: "Mint & Trade",
      description:
        "Mint verified NFTs and trade them in our secure marketplace with transparent pricing.",
      step: "03",
    },
    {
      icon: Trophy,
      title: "Earn & Grow",
      description:
        "Get verified as a creator and build your reputation in the digital art ecosystem.",
      step: "04",
    },
  ];

  return (
    <section className="bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-4xl font-light md:text-5xl">
            How It Works
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">
            Get started with OriginStamp in just four simple steps and join the
            future of digital art authentication
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="bg-card group border transition-all duration-300 hover:shadow-md"
              >
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="text-muted/30 absolute -top-4 -right-4 text-6xl font-light">
                      {feature.step}
                    </div>
                    <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-105">
                      <Icon className="text-foreground h-8 w-8" />
                    </div>
                  </div>

                  <h3 className="text-foreground mb-4 text-xl font-medium">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="space-y-6">
            <h3 className="text-foreground text-2xl font-light">
              Ready to start your NFT journey?
            </h3>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="px-8 font-medium">
                Get Started Now
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Explore Marketplace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
