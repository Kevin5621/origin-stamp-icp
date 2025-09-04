import React from "react";
import { Bell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface NotificationSettings {
  session_notifications: boolean;
  marketplace_updates: boolean;
  collection_alerts: boolean;
  email_digest: boolean;
}

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onSettingChange: (setting: keyof NotificationSettings) => void;
}

export const NotificationSettingsCard: React.FC<NotificationSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const notificationItems = [
    {
      key: "session_notifications" as keyof NotificationSettings,
      title: "Session Notifications",
      description:
        "Get notified when your art sessions are ready for certification",
      enabled: settings.session_notifications,
    },
    {
      key: "marketplace_updates" as keyof NotificationSettings,
      title: "Marketplace Updates",
      description: "Receive updates about new artworks and price changes",
      enabled: settings.marketplace_updates,
    },
    {
      key: "collection_alerts" as keyof NotificationSettings,
      title: "Collection Alerts",
      description: "Notifications about your NFT collection performance",
      enabled: settings.collection_alerts,
    },
    {
      key: "email_digest" as keyof NotificationSettings,
      title: "Email Digest",
      description: "Weekly summary of your OriginStamp activity",
      enabled: settings.email_digest,
    },
  ];

  return (
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
          {notificationItems.map((item, index) => (
            <div key={item.key}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-foreground text-sm font-medium">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
                <Switch
                  checked={item.enabled}
                  onCheckedChange={() => onSettingChange(item.key)}
                  aria-label={`Toggle ${item.title}`}
                />
              </div>
              {index < notificationItems.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
