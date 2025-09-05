import React from "react";
import {
  Palette,
  Award,
  TrendingUp,
  Activity,
  CheckCircle,
  Store,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { DashboardCard, RecentActivity } from "@/types/dashboard";

export const DashboardPage: React.FC = () => {
  // Customer-focused metrics
  const dashboardCards: DashboardCard[] = [
    {
      title: "My Art Sessions",
      value: "12",
      description: "3 active sessions",
      trend: { value: 2, isPositive: true },
      icon: Palette,
    },
    {
      title: "My Certificates",
      value: "8",
      description: "All verified",
      trend: { value: 1, isPositive: true },
      icon: Award,
    },
    {
      title: "NFTs Owned",
      value: "24",
      description: "+3 this month",
      trend: { value: 3, isPositive: true },
      icon: Package,
    },
    {
      title: "Portfolio Value",
      value: "45.8 ICP",
      description: "+12.5% this month",
      trend: { value: 12.5, isPositive: true },
      icon: TrendingUp,
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "certificate",
      title: "Certificate #896 Created",
      description: "Your 'Abstract Digital Painting' has been certified",
      timestamp: "2 minutes ago",
      status: "completed",
      metadata: { certificate_id: "cert_896", verification_score: 98 },
    },
    {
      id: "2",
      type: "session",
      title: "New Art Session Started",
      description: "Upload photos for 'Modern Landscape Series'",
      timestamp: "15 minutes ago",
      status: "pending",
      metadata: { session_id: "session_3841", file_count: 5 },
    },
    {
      id: "3",
      type: "purchase",
      title: "NFT Purchased",
      description: "Added 'Digital Abstract #123' to your collection",
      timestamp: "1 hour ago",
      status: "completed",
      metadata: { nft_id: "nft_123", price: "2.5 ICP" },
    },
    {
      id: "4",
      type: "upload",
      title: "Photos Uploaded",
      description: "5 new photos added to session #3840",
      timestamp: "2 hours ago",
      status: "completed",
      metadata: { session_id: "session_3840", file_count: 5 },
    },
  ];

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "certificate":
        return Award;
      case "session":
        return Palette;
      case "purchase":
        return Store;
      case "verification":
        return CheckCircle;
      case "upload":
        return Activity;
      default:
        return Activity;
    }
  };

  const getStatusBadge = (status: RecentActivity["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground"
          >
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Welcome Message */}
      <div className="from-primary/10 to-secondary/10 rounded-lg bg-gradient-to-r p-6">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          Welcome back, Artist! 🎨
        </h2>
        <p className="text-muted-foreground">
          Ready to create and certify your next masterpiece? Start a new art
          session or explore the marketplace.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-border bg-card border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-card-foreground text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-card-foreground text-2xl font-bold">
                  {card.value}
                </div>
                <p className="text-muted-foreground text-xs">
                  {card.trend && (
                    <span
                      className={`inline-flex items-center ${
                        card.trend.isPositive
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {card.trend.isPositive ? "+" : ""}
                      {card.trend.value}
                    </span>
                  )}{" "}
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="border-border bg-card border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest art sessions and marketplace activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full">
                      <Icon className="text-secondary-foreground h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-card-foreground text-sm font-medium">
                        {activity.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(activity.status)}
                        <span className="text-muted-foreground text-xs">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < recentActivities.length - 1 && (
                    <Separator className="bg-border mt-4" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border bg-card border">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Quick Actions
            </CardTitle>
            <CardDescription>Start creating or exploring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full justify-start">
              <Palette className="mr-2 h-4 w-4" />
              Start New Session
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-accent w-full justify-start"
            >
              <Store className="mr-2 h-4 w-4" />
              Browse Marketplace
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-accent w-full justify-start"
            >
              <Package className="mr-2 h-4 w-4" />
              View My Collection
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-accent w-full justify-start"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Check Certificates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Overview */}
      <Card className="border-border bg-card border">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-muted grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-card-foreground text-sm font-medium">
                    Total Art Value
                  </h4>
                  <p className="text-card-foreground text-2xl font-bold">
                    45.8 ICP
                  </p>
                  <p className="text-muted-foreground text-xs">
                    +12.5% from last month
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-card-foreground text-sm font-medium">
                    Active Sessions
                  </h4>
                  <p className="text-card-foreground text-2xl font-bold">3</p>
                  <p className="text-muted-foreground text-xs">
                    2 ready for certification
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="mt-6">
              <div className="py-8 text-center">
                <Palette className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  Your art sessions activity will be displayed here
                </p>
              </div>
            </TabsContent>

            <TabsContent value="collection" className="mt-6">
              <div className="py-8 text-center">
                <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  Your NFT collection overview will be displayed here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
