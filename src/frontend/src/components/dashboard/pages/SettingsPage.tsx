import React from "react";
import { Settings, User, Shield, Bell, Palette, Globe } from "lucide-react";
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

export const SettingsPage: React.FC = () => {
  const settingsCategories = [
    {
      id: "profile",
      name: "Profile Settings",
      description: "Manage your personal information and preferences",
      icon: User,
      settings: [
        {
          name: "Profile Visibility",
          description: "Make your profile public",
          enabled: true,
        },
        {
          name: "Activity Status",
          description: "Show when you're online",
          enabled: false,
        },
        {
          name: "Email Notifications",
          description: "Receive email updates",
          enabled: true,
        },
      ],
    },
    {
      id: "security",
      name: "Security & Privacy",
      description: "Configure security settings and privacy controls",
      icon: Shield,
      settings: [
        {
          name: "Two-Factor Authentication",
          description: "Enable 2FA for extra security",
          enabled: true,
        },
        {
          name: "Session Timeout",
          description: "Auto-logout after inactivity",
          enabled: true,
        },
        {
          name: "Data Collection",
          description: "Allow analytics data collection",
          enabled: false,
        },
      ],
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "Control how and when you receive notifications",
      icon: Bell,
      settings: [
        {
          name: "Push Notifications",
          description: "Browser push notifications",
          enabled: true,
        },
        {
          name: "Email Digest",
          description: "Weekly summary email",
          enabled: false,
        },
        {
          name: "Marketing Emails",
          description: "Promotional content",
          enabled: false,
        },
      ],
    },
    {
      id: "appearance",
      name: "Appearance",
      description: "Customize the look and feel of your dashboard",
      icon: Palette,
      settings: [
        { name: "Dark Mode", description: "Use dark theme", enabled: false },
        {
          name: "Compact Layout",
          description: "Reduce spacing and padding",
          enabled: false,
        },
        {
          name: "Animations",
          description: "Enable interface animations",
          enabled: true,
        },
      ],
    },
  ];

  const systemSettings = [
    {
      name: "Platform Status",
      description: "All systems operational",
      status: "healthy",
      icon: Globe,
    },
    {
      name: "API Rate Limit",
      description: "1000 requests per hour",
      status: "normal",
      icon: Settings,
    },
    {
      name: "Storage Usage",
      description: "2.4 GB of 10 GB used",
      status: "normal",
      icon: Settings,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500 text-white">Healthy</Badge>;
      case "normal":
        return <Badge className="bg-blue-500 text-white">Normal</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Configure your account and platform preferences
        </p>
      </div>

      {/* User Settings */}
      <div className="space-y-6">
        {settingsCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon className="h-5 w-5" />
                  <span>{category.name}</span>
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.settings.map((setting) => (
                    <div key={setting.name}>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="text-foreground text-sm font-medium">
                            {setting.name}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {setting.description}
                          </p>
                        </div>
                        <Switch
                          checked={setting.enabled}
                          aria-label={`Toggle ${setting.name}`}
                        />
                      </div>
                      {category.settings.indexOf(setting) <
                        category.settings.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Platform health and system information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemSettings.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="text-muted-foreground h-5 w-5" />
                      <div>
                        <h4 className="text-foreground text-sm font-medium">
                          {item.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  {systemSettings.indexOf(item) < systemSettings.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Dangerous actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-foreground text-sm font-medium">
                Export Data
              </h4>
              <p className="text-muted-foreground text-sm">
                Download all your account data
              </p>
            </div>
            <Button variant="outline">Export</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-foreground text-sm font-medium">
                Delete Account
              </h4>
              <p className="text-muted-foreground text-sm">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
