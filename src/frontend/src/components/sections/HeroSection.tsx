"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import Image from "next/image";
import {
  BackendService,
  type NFTMarketplaceStats,
} from "@/services/backendService";

export function HeroSection() {
  const [stats, setStats] = useState<NFTMarketplaceStats>({
    totalArtworks: "0+",
    totalCreators: "0+",
    totalSessions: "0+",
  });

  useEffect(() => {
    BackendService.getMarketplaceStats().then(setStats);
  }, []);

  return (
    <section className="bg-background relative min-h-screen overflow-hidden">
      <div className="from-muted/20 via-background to-muted/10 absolute inset-0 bg-gradient-to-br" />

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="grid min-h-[80vh] items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-foreground text-4xl leading-tight font-light md:text-6xl lg:text-7xl">
                Discover, collect, and{" "}
                <span className="text-primary font-medium">
                  sell extraordinary NFTs
                </span>
              </h1>

              <p className="text-muted-foreground max-w-lg text-lg leading-relaxed md:text-xl">
                OriginStamp is the world&apos;s first blockchain-powered art
                authentication and NFT marketplace
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="px-8 py-6 text-lg font-medium">
                Discover Now
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                Learn More
              </Button>
            </div>

            <div className="bg-card rounded-2xl border p-8 shadow-sm">
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-foreground text-3xl font-light md:text-4xl">
                    {stats.totalArtworks}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    Artworks
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-foreground text-3xl font-light md:text-4xl">
                    {stats.totalSessions}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    Sessions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-foreground text-3xl font-light md:text-4xl">
                    {stats.totalCreators}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    Creators
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <div className="bg-card rounded-3xl border p-1 shadow-lg">
                <div className="bg-background rounded-3xl border p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      ⚡ Verified
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-muted text-muted-foreground border-border"
                    >
                      💎 Certified
                    </Badge>
                  </div>

                  <div className="bg-muted relative mb-6 aspect-square overflow-hidden rounded-2xl border">
                    <Image
                      src="/api/placeholder/400/400"
                      alt="Featured NFT"
                      fill
                      className="rounded-2xl object-cover"
                    />
                    <div className="from-background/20 absolute inset-0 bg-gradient-to-t to-transparent" />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-background/80 hover:bg-background absolute top-4 right-4 border"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-foreground text-xl font-medium">
                      Cosmic Dreams #1
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-muted h-8 w-8 rounded-full border"></div>
                        <span className="text-muted-foreground font-medium">
                          ArtistOne
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-sm">
                          Price
                        </div>
                        <div className="text-foreground font-medium">
                          2.5 ICP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 lg:-right-12">
              <div className="bg-card rotate-6 transform rounded-2xl border p-1 shadow-md">
                <div className="bg-background rounded-2xl border p-4">
                  <div className="bg-muted relative mb-3 h-24 w-24 overflow-hidden rounded-xl border">
                    <Image
                      src="/api/placeholder/200/200"
                      alt="Secondary NFT"
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>
                  <div className="text-muted-foreground text-xs font-medium">
                    Neural Networks
                  </div>
                  <div className="text-foreground text-sm font-medium">
                    1.8 ICP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
