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
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h3 className="text-foreground mb-4 text-2xl font-light">
            Stay in the loop
          </h3>
          <p className="text-muted-foreground mx-auto mb-6 max-w-md leading-relaxed">
            Join our mailing list to stay in the loop with our newest feature
            releases, NFT drops, and tips and tricks for navigating OriginStamp.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-background text-foreground placeholder:text-muted-foreground border"
            />
            <Button className="font-medium">Sign up</Button>
          </div>
        </div>

        <Separator className="bg-border mb-12" />

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <Image
                src="/favicon.ico"
                alt="OriginStamp Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-foreground text-xl font-medium">
                OriginStamp
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
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
                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-foreground mb-4 font-medium">Marketplace</h4>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-4 font-medium">Account</h4>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-4 font-medium">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-4 font-medium">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
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
          <div className="text-muted-foreground mb-4 text-sm font-medium md:mb-0">
            © 2024 OriginStamp, Inc. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
