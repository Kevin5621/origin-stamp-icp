"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, Wallet, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  readonly className?: string;
}

export function NavigationHeader({ className }: NavigationHeaderProps) {
  const [isConnected, setIsConnected] = useState(false);

  const navigationItems = [
    { title: "Discover", href: "/discover" },
    { title: "Marketplace", href: "/marketplace" },
    { title: "Creators", href: "/creators" },
    { title: "Stats", href: "/stats" },
    { title: "Support", href: "/support" },
  ];

  const handleConnectWallet = () => {
    setIsConnected(!isConnected);
  };

  return (
    <header
      className={cn(
        "border-border bg-background sticky top-0 z-50 w-full border-b shadow-sm",
        className,
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-sm font-medium">
              ⚡
            </span>
          </div>
          <span className="text-foreground text-xl font-medium">
            OriginStamp
          </span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-6">
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {item.title}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-muted flex items-center space-x-2"
                >
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback className="bg-muted text-foreground">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-foreground hidden font-medium md:block">
                    User
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-background w-56 border shadow-lg"
              >
                <DropdownMenuItem className="text-foreground hover:text-foreground hover:bg-muted">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:text-foreground hover:bg-muted">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  className="text-foreground hover:text-foreground hover:bg-muted"
                  onClick={handleConnectWallet}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleConnectWallet} className="font-medium">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-background border shadow-lg"
            >
              <div className="mt-8 flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="text-foreground hover:text-foreground py-2 font-medium transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
