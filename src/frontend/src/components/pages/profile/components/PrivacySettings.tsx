import React from "react";
import { Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface PrivacySettings {
  public_profile: boolean;
  show_collection: boolean;
  activity_status: boolean;
  session_history: boolean;
}

interface PrivacySettingsProps {
  settings: PrivacySettings;
  onSettingChange: (setting: keyof PrivacySettings) => void;
}

export const PrivacySettingsCard: React.FC<PrivacySettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const privacyItems = [
    {
      key: "public_profile" as keyof PrivacySettings,
      title: "Public Profile",
      description: "Make your profile visible to other users",
      enabled: settings.public_profile,
    },
    {
      key: "show_collection" as keyof PrivacySettings,
      title: "Show Collection",
      description: "Display your NFT collection publicly",
      enabled: settings.show_collection,
    },
    {
      key: "activity_status" as keyof PrivacySettings,
      title: "Activity Status",
      description: "Show when you&apos;re online and active",
      enabled: settings.activity_status,
    },
    {
      key: "session_history" as keyof PrivacySettings,
      title: "Session History",
      description: "Make your art session history public",
      enabled: settings.session_history,
    },
  ];

  return (
    <Card>
      <CardHeader className="px-6 pb-4 pt-6">
        <div className="space-y-2">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="bg-primary/10 rounded-lg p-2">
              <Shield className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            Privacy Settings
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Control who can see your profile and activity
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4 sm:space-y-6">
          {privacyItems.map((item, index) => (
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
              {index < privacyItems.length - 1 && (
                <Separator className="mt-4 sm:mt-6" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
