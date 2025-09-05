"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <section id="features" className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 mb-4"
          >
            Features
          </Badge>
          <h2 className="text-foreground mb-6 text-3xl font-light md:text-4xl lg:text-5xl">
            Why Choose{" "}
            <span className="text-primary font-medium">OriginStamp</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            Experience the future of art authentication with our cutting-edge
            blockchain technology
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-border hover:border-primary/50 relative overflow-hidden transition-all duration-300"
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
              <div className="relative z-10">
                <CardHeader>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <feature.icon className="text-primary h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-foreground text-xl font-medium">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="px-8 py-6 text-lg font-medium">
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
}
