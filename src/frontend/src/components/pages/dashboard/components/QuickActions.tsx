import React from "react";
import { Palette, Store, Package, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const QuickActions: React.FC = () => {
  const router = useRouter();

  const handleStartSession = () => {
    router.push("/sessions/create");
  };

  const handleBrowseMarketplace = () => {
    router.push("/marketplace");
  };

  const handleViewCollection = () => {
    router.push("/collection");
  };

  const handleCheckCertificates = () => {
    router.push("/profile");
  };

  return (
    <Card className="border-border bg-card border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
        <CardDescription>Start creating or exploring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full justify-start"
          onClick={handleStartSession}
        >
          <Palette className="mr-2 h-4 w-4" />
          Start New Session
        </Button>
        <Button
          variant="outline"
          className="border-border text-foreground hover:bg-accent w-full justify-start"
          onClick={handleBrowseMarketplace}
        >
          <Store className="mr-2 h-4 w-4" />
          Browse Marketplace
        </Button>
        <Button
          variant="outline"
          className="border-border text-foreground hover:bg-accent w-full justify-start"
          onClick={handleViewCollection}
        >
          <Package className="mr-2 h-4 w-4" />
          View My Collection
        </Button>
        <Button
          variant="outline"
          className="border-border text-foreground hover:bg-accent w-full justify-start"
          onClick={handleCheckCertificates}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Check Certificates
        </Button>
      </CardContent>
    </Card>
  );
};
