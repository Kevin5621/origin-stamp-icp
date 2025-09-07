"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Camera, Code, Video } from "lucide-react";

export function Footer() {
  const footerLinks = {
    marketplace: [
      { title: "Explore", href: "/explore" },
      { title: "Art", href: "/art" },
      { title: "Photography", href: "/photography" },
      { title: "Games", href: "/games" },
      { title: "Metaverses", href: "/metaverses" },
    ],
    account: [
      { title: "Profile", href: "/profile" },
      { title: "Favorites", href: "/favorites" },
      { title: "My Collections", href: "/collections" },
      { title: "Settings", href: "/settings" },
    ],
    resources: [
      { title: "Help Center", href: "/help" },
      { title: "Platform Status", href: "/status" },
      { title: "Partners", href: "/partners" },
      { title: "Gas-Free Marketplace", href: "/gas-free" },
      { title: "Suggestions", href: "/suggestions" },
      { title: "Blog", href: "/blog" },
      { title: "Docs", href: "/docs" },
      { title: "Newsletter", href: "/newsletter" },
    ],
    company: [
      { title: "About", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Ventures", href: "/ventures" },
      { title: "Grants", href: "/grants" },
    ],
  };

  const socialLinks = [
    { icon: MessageCircle, href: "https://twitter.com", label: "Twitter" },
    { icon: Camera, href: "https://instagram.com", label: "Instagram" },
    { icon: Code, href: "https://github.com", label: "Github" },
    { icon: Video, href: "https://youtube.com", label: "Youtube" },
  ];

  return (
    <footer className="bg-background border-border border-t">
      <div className="container mx-auto px-6 py-20">
        <div className="mb-20 text-center">
          <h3 className="text-foreground mb-6 text-3xl font-light">
            Stay in the loop
          </h3>
          <p className="text-muted-foreground mx-auto mb-8 max-w-lg text-lg leading-relaxed">
            Join our mailing list to stay in the loop with our newest feature
            releases, NFT drops, and tips and tricks for navigating OriginStamp.
          </p>
          <div className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-background text-foreground placeholder:text-muted-foreground h-12 border text-base"
            />
            <Button className="bg-primary hover:bg-primary/90 h-12 px-8 font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Sign up
            </Button>
          </div>
        </div>

        <Separator className="bg-border mb-12" />

        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="group mb-6 flex items-center space-x-3">
              <Image
                src="/favicon.ico"
                alt="OriginStamp Logo"
                width={36}
                height={36}
                className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-foreground text-2xl font-semibold">
                OriginStamp
              </span>
            </Link>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              The world&apos;s first blockchain-powered digital marketplace for
              crypto collectibles and authenticated physical artwork.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-3 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="h-6 w-6" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-foreground mb-6 text-lg font-semibold">
              Marketplace
            </h4>
            <ul className="space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-base font-medium transition-colors hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-6 text-lg font-semibold">
              Account
            </h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-base font-medium transition-colors hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-6 text-lg font-semibold">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-base font-medium transition-colors hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-6 text-lg font-semibold">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-base font-medium transition-colors hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-border mb-8" />

        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="text-muted-foreground mb-6 text-base font-medium md:mb-0">
            © 2025 OriginStamp, Inc. All rights reserved.
          </div>
          <div className="flex space-x-8">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-base font-medium transition-colors hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-base font-medium transition-colors hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
