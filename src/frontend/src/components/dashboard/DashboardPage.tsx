import React from "react";
import {
  Users,
  Award,
  Camera,
  TrendingUp,
  Activity,
  CheckCircle,
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
import type {
  DashboardCard,
  DashboardMetrics,
  RecentActivity,
} from "@/types/dashboard";

interface DashboardPageProps {
  className?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ className }) => {
  // Data akan didapat dari service/backend
  const metrics: DashboardMetrics = {
    total_users: 1250,
    total_sessions: 3840,
    total_certificates: 896,
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: "Total Users",
      value: metrics.total_users.toLocaleString(),
      description: "+12% from last month",
      trend: { value: 12, isPositive: true },
      icon: Users,
    },
    {
      title: "Art Sessions",
      value: metrics.total_sessions.toLocaleString(),
      description: "+23% from last month",
      trend: { value: 23, isPositive: true },
      icon: Camera,
    },
    {
      title: "Certificates",
      value: metrics.total_certificates.toLocaleString(),
      description: "+8% from last month",
      trend: { value: 8, isPositive: true },
      icon: Award,
    },
    {
      title: "Verification Rate",
      value: "94.2%",
      description: "+2.1% from last month",
      trend: { value: 2.1, isPositive: true },
      icon: CheckCircle,
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "certificate",
      title: "Digital Art Certificate Created",
      description: "Certificate #896 for 'Abstract Digital Painting'",
      timestamp: "2 minutes ago",
      status: "completed",
      metadata: { certificate_id: "cert_896", verification_score: 98 },
    },
    {
      id: "2",
      type: "session",
      title: "New Art Session Started",
      description: "Physical art session by @artist_john",
      timestamp: "15 minutes ago",
      status: "pending",
      metadata: { session_id: "session_3841", file_count: 5 },
    },
    {
      id: "3",
      type: "verification",
      title: "Certificate Verified",
      description: "Certificate #895 verification completed",
      timestamp: "1 hour ago",
      status: "completed",
      metadata: { certificate_id: "cert_895", verification_score: 95 },
    },
    {
      id: "4",
      type: "upload",
      title: "Files Uploaded",
      description: "12 photos uploaded to session #3840",
      timestamp: "2 hours ago",
      status: "completed",
      metadata: { session_id: "session_3840", file_count: 12 },
    },
  ];

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "certificate":
        return Award;
      case "session":
        return Camera;
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
    <div className={`space-y-6 p-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your OriginStamp
          platform.
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
                      {card.trend.value}%
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
              Latest activities and updates from your platform
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
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full justify-start">
              <Camera className="mr-2 h-4 w-4" />
              Start New Session
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-accent w-full justify-start"
            >
              <Award className="mr-2 h-4 w-4" />
              Generate Certificate
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-accent w-full justify-start"
            >
              <Activity className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-accent w-full justify-start"
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tab Section */}
      <Card className="border-border bg-card border">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-muted grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-card-foreground text-sm font-medium">
                    Platform Growth
                  </h4>
                  <p className="text-card-foreground text-2xl font-bold">
                    +24.5%
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Compared to last month
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-card-foreground text-sm font-medium">
                    Active Users
                  </h4>
                  <p className="text-card-foreground text-2xl font-bold">892</p>
                  <p className="text-muted-foreground text-xs">
                    Users active this week
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <div className="py-8 text-center">
                <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  User analytics will be displayed here
                </p>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="mt-6">
              <div className="py-8 text-center">
                <Camera className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  Session analytics will be displayed here
                </p>
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="mt-6">
              <div className="py-8 text-center">
                <Award className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  Certificate analytics will be displayed here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
