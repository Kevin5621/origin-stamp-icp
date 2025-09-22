"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Globe, Users, Lock, BarChart3 } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Shield,
    title: "Blockchain Authentication",
    description:
      "Immutable proof of authenticity using Internet Computer blockchain technology",
    badge: "Security",
    image: "/landing/blockchain-authenticatio.webp",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description:
      "Real-time verification of artwork authenticity with cryptographic proofs",
    badge: "Speed",
    image: "/landing/instant-verification.webp",
  },
  {
    icon: Globe,
    title: "Global Access",
    description:
      "Access your authenticated artworks from anywhere in the world",
    badge: "Accessibility",
    image: "/landing/global-access.webp",
  },
  {
    icon: Users,
    title: "Creator Community",
    description: "Join a thriving community of artists and collectors",
    badge: "Community",
    image: "/landing/creator-comunity.webp",
  },
  {
    icon: Lock,
    title: "Secure Storage",
    description:
      "Military-grade encryption for all your artwork data and metadata",
    badge: "Privacy",
    image: "/landing/secure-storage.webp",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your artwork performance and market insights",
    badge: "Analytics",
    image: "/landing/analytics-dashboard.webp",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-32">
      <div className="container mx-auto px-6">
        <div className="mb-20 text-center">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 mb-6 px-4 py-2 text-sm font-medium"
          >
            Features
          </Badge>
          <h2 className="text-foreground mb-8 text-4xl font-light md:text-5xl lg:text-6xl">
            Why Choose{" "}
            <span className="text-primary font-medium">OriginStamp</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed">
            Experience the future of art authentication with our cutting-edge
            blockchain technology
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border hover:border-primary/50 group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-70"
                />
                <div className="bg-background/80 group-hover:bg-background/60 absolute inset-0 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="bg-primary/15 rounded-xl p-4 shadow-lg">
                    <feature.icon className="text-primary h-7 w-7" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-medium"
                  >
                    {feature.badge}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h3 className="text-foreground text-2xl font-semibold leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 px-10 py-6 text-lg font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
}
