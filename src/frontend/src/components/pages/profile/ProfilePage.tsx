import React from "react";
import { User, Shield, Bell, Palette, Camera, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const profileStats = [
    { label: "Art Sessions", value: "12", icon: Camera },
    { label: "NFTs Owned", value: "24", icon: Palette },
    { label: "Certificates", value: "8", icon: Shield },
    { label: "Days Active", value: "89", icon: User },
  ];

  const notificationSettings = [
    {
      title: "Session Notifications",
      description:
        "Get notified when your art sessions are ready for certification",
      enabled: true,
    },
    {
      title: "Marketplace Updates",
      description: "Receive updates about new artworks and price changes",
      enabled: false,
    },
    {
      title: "Collection Alerts",
      description: "Notifications about your NFT collection performance",
      enabled: true,
    },
    {
      title: "Email Digest",
      description: "Weekly summary of your OriginStamp activity",
      enabled: false,
    },
  ];

  const privacySettings = [
    {
      title: "Public Profile",
      description: "Make your profile visible to other users",
      enabled: true,
    },
    {
      title: "Show Collection",
      description: "Display your NFT collection publicly",
      enabled: false,
    },
    {
      title: "Activity Status",
      description: "Show when you're online and active",
      enabled: false,
    },
    {
      title: "Session History",
      description: "Make your art session history public",
      enabled: true,
    },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "session",
      title: "Started new art session",
      description: "Modern Landscape Series",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "certificate",
      title: "Certificate generated",
      description: "Abstract Digital Painting #896",
      timestamp: "1 day ago",
    },
    {
      id: "3",
      type: "purchase",
      title: "NFT purchased",
      description: "Urban Street Art #123",
      timestamp: "3 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src="/placeholder-avatar.jpg"
                  alt={user?.username}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-foreground text-2xl font-bold">
                  {user?.username || "Your Name"}
                </h2>
                <p className="text-muted-foreground">
                  {user?.email || "your.email@example.com"}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Digital Artist
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {profileStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="mb-2 flex items-center justify-center">
                        <Icon className="text-muted-foreground h-5 w-5" />
                      </div>
                      <div className="text-foreground text-2xl font-bold">
                        {stat.value}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">
                    Display Name
                  </label>
                  <div className="border-border flex items-center justify-between rounded-md border p-3">
                    <span className="text-foreground">
                      {user?.username || "Your Name"}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">
                    Email Address
                  </label>
                  <div className="border-border flex items-center justify-between rounded-md border p-3">
                    <span className="text-foreground">
                      {user?.email || "your.email@example.com"}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">
                  Bio
                </label>
                <div className="border-border bg-muted/50 rounded-md border p-3">
                  <p className="text-muted-foreground text-sm">
                    Tell others about yourself, your art style, and what
                    inspires you...
                  </p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Edit className="mr-2 h-4 w-4" />
                    Add Bio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-foreground text-sm font-medium">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-foreground text-sm font-medium">
                    Change Password
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Update your account password
                  </p>
                </div>
                <Button variant="outline">Change</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-foreground text-sm font-medium">
                    Connected Wallets
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Manage your connected cryptocurrency wallets
                  </p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div key={setting.title}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground text-sm font-medium">
                          {setting.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {setting.description}
                        </p>
                      </div>
                      <Switch
                        checked={setting.enabled}
                        aria-label={`Toggle ${setting.title}`}
                      />
                    </div>
                    {notificationSettings.indexOf(setting) <
                      notificationSettings.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can see your profile and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {privacySettings.map((setting) => (
                  <div key={setting.title}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground text-sm font-medium">
                          {setting.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {setting.description}
                        </p>
                      </div>
                      <Switch
                        checked={setting.enabled}
                        aria-label={`Toggle ${setting.title}`}
                      />
                    </div>
                    {privacySettings.indexOf(setting) <
                      privacySettings.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and interactions on OriginStamp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-center space-x-4">
                      <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full">
                        {activity.type === "session" && (
                          <Camera className="h-5 w-5" />
                        )}
                        {activity.type === "certificate" && (
                          <Shield className="h-5 w-5" />
                        )}
                        {activity.type === "purchase" && (
                          <Palette className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-foreground text-sm font-medium">
                          {activity.title}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {activity.description}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                    {index < recentActivity.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
