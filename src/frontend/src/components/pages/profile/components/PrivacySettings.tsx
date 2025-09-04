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
          {privacyItems.map((item, index) => (
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
              {index < privacyItems.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
