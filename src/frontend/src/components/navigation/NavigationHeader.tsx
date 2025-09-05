"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { useProfilePicture } from "@/hooks/useProfilePicture";
import { Menu, User, LogOut, Settings } from "lucide-react";
import Image from "next/image";

export function NavigationHeader() {
  const { user, logout } = useAuth();
  const { profilePicture } = useProfilePicture();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-background/90 border-border sticky top-0 z-50 border-b shadow-sm backdrop-blur-lg">
      <div className="container mx-auto px-6">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="space-x-8">
                <NavigationMenuItem>
                  <Link
                    href="/dashboard/marketplace"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-2 text-base font-medium transition-colors"
                  >
                    Marketplace
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/dashboard/subscription"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-2 text-base font-medium transition-colors"
                  >
                    Pricing
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-2 text-base font-medium transition-colors"
                  >
                    About
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu / Connect Wallet */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-muted/50 relative h-10 w-10 rounded-full transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profilePicture} alt={user.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-foreground font-medium">
                        {user.username}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Connected to Internet Computer
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/subscription"
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Subscription
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-primary hover:bg-primary/90 px-6 py-2 text-base font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Connect Wallet
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-8 flex flex-col space-y-4">
                  <Link
                    href="/dashboard/marketplace"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Marketplace
                  </Link>
                  <Link
                    href="/dashboard/subscription"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                  {!user && (
                    <Button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="mt-4"
                    >
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}
