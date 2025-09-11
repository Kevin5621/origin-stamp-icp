import React from "react";
import { User, Shield, Lock, Mail, MapPin, Save, X, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface UserProfile {
  username: string;
  display_name?: string;
  email?: string;
  bio?: string;
  location?: string;
  profile_picture?: string;
  created_at?: bigint;
  updated_at?: bigint;
}

interface ProfileForm {
  display_name: string;
  email: string;
  bio: string;
  location: string;
}

interface ProfileSettingsProps {
  userProfile: UserProfile | null;
  profileForm: ProfileForm;
  editingProfile: boolean;
  loading: boolean;
  onProfileFormChange: (field: keyof ProfileForm, value: string) => void;
  onEditToggle: () => void;
  onSave: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  userProfile,
  profileForm,
  editingProfile,
  loading,
  onProfileFormChange,
  onEditToggle,
  onSave,
}) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="bg-primary/10 rounded-lg p-2">
                  <User className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Update your personal details and profile information
              </CardDescription>
            </div>
            <Button
              variant={editingProfile ? "outline" : "primary"}
              onClick={onEditToggle}
              className="w-full sm:w-auto"
            >
              {editingProfile ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6 sm:space-y-8">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <User className="h-4 w-4" />
                Display Name
              </label>
              {editingProfile ? (
                <Input
                  value={profileForm.display_name}
                  onChange={(e) =>
                    onProfileFormChange("display_name", e.target.value)
                  }
                  placeholder="Enter your display name"
                  className="h-11 sm:h-12"
                />
              ) : (
                <div className="border-border bg-muted/30 flex h-11 items-center justify-between rounded-lg border p-3 sm:h-12">
                  <span className="text-foreground font-medium">
                    {userProfile?.display_name ||
                      userProfile?.username ||
                      "Not set"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <User className="text-muted-foreground h-4 w-4" />
                Username (cannot be changed)
              </label>
              <div className="border-border bg-muted/50 flex h-11 items-center justify-between rounded-lg border p-3 sm:h-12">
                <span className="text-muted-foreground font-medium">
                  @{userProfile?.username || "username"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              {editingProfile ? (
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => onProfileFormChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="h-11 sm:h-12"
                />
              ) : (
                <div className="border-border bg-muted/30 flex h-11 items-center justify-between rounded-lg border p-3 sm:h-12">
                  <span className="text-foreground font-medium">
                    {userProfile?.email || "your.email@example.com"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              {editingProfile ? (
                <Input
                  value={profileForm.location}
                  onChange={(e) =>
                    onProfileFormChange("location", e.target.value)
                  }
                  placeholder="City, Country"
                  className="h-11 sm:h-12"
                />
              ) : (
                <div className="border-border bg-muted/30 flex h-11 items-center justify-between rounded-lg border p-3 sm:h-12">
                  <span className="text-foreground font-medium">
                    {userProfile?.location || "Not provided"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6 sm:my-8" />

          <div className="space-y-3">
            <label
              htmlFor="bio-textarea"
              className="text-foreground text-sm font-semibold"
            >
              Bio
            </label>
            {editingProfile ? (
              <Textarea
                id="bio-textarea"
                value={profileForm.bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onProfileFormChange("bio", e.target.value)
                }
                placeholder="Tell others about yourself, your art style, and what inspires you..."
                className="min-h-[120px] resize-none"
              />
            ) : (
              <div className="border-border bg-muted/30 min-h-[120px] rounded-lg border p-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {userProfile?.bio ||
                    "Tell others about yourself, your art style, and what inspires you..."}
                </p>
              </div>
            )}
          </div>

          {editingProfile && (
            <div className="flex justify-end pt-4 sm:pt-6">
              <Button onClick={onSave} disabled={loading} size="lg">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="bg-primary/10 rounded-lg p-2">
                <Shield className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              Security
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Manage your account security settings
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6 sm:space-y-6">
          <div className="bg-muted/20 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
            <div className="flex-1 space-y-1">
              <h4 className="text-foreground text-sm font-semibold sm:text-base">
                Two-Factor Authentication
              </h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full self-start sm:w-auto sm:self-center"
            >
              <Lock className="mr-2 h-4 w-4" />
              Enable
            </Button>
          </div>

          <Separator />

          <div className="bg-muted/20 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
            <div className="flex-1 space-y-1">
              <h4 className="text-foreground text-sm font-semibold sm:text-base">
                Change Password
              </h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Update your account password
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full self-start sm:w-auto sm:self-center"
            >
              <Lock className="mr-2 h-4 w-4" />
              Change
            </Button>
          </div>

          <Separator />

          <div className="bg-muted/20 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
            <div className="flex-1 space-y-1">
              <h4 className="text-foreground text-sm font-semibold sm:text-base">
                Connected Wallets
              </h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Manage your connected cryptocurrency wallets
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full self-start sm:w-auto sm:self-center"
            >
              <Shield className="mr-2 h-4 w-4" />
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
