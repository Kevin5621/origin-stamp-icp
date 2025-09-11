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
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="space-y-2">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="bg-primary/10 rounded-lg p-2">
              <Bell className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Choose what notifications you want to receive
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4 sm:space-y-6">
          {notificationItems.map((item, index) => (
            <div key={item.key}>
              <div className="bg-muted/20 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
                <div className="flex-1 space-y-1">
                  <h4 className="text-foreground text-sm font-semibold sm:text-base">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground pr-4 text-xs leading-relaxed sm:text-sm">
                    {item.description}
                  </p>
                </div>
                <div className="flex-shrink-0 self-start sm:self-center">
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={() => onSettingChange(item.key)}
                    aria-label={`Toggle ${item.title}`}
                  />
                </div>
              </div>
              {index < notificationItems.length - 1 && (
                <Separator className="mt-4 sm:mt-6" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
