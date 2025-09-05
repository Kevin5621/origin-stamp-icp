import React from "react";
import {
  User,
  Shield,
  Lock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  X,
  Edit,
} from "lucide-react";
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
  email?: string;
  bio?: string;
  phone?: string;
  location?: string;
  profile_picture?: string;
  created_at?: bigint;
  updated_at?: bigint;
}

interface ProfileForm {
  email: string;
  bio: string;
  phone: string;
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </div>
            <Button
              variant={editingProfile ? "outline" : "primary"}
              onClick={onEditToggle}
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
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Display Name
              </label>
              {editingProfile ? (
                <Input
                  value={userProfile?.username || ""}
                  disabled
                  className="bg-muted/50"
                  placeholder="Username cannot be changed"
                />
              ) : (
                <div className="border-border flex items-center justify-between rounded-md border p-3">
                  <span className="text-foreground">
                    {userProfile?.username || "Your Name"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              {editingProfile ? (
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => onProfileFormChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              ) : (
                <div className="border-border flex items-center justify-between rounded-md border p-3">
                  <span className="text-foreground">
                    {userProfile?.email || "your.email@example.com"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-foreground flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              {editingProfile ? (
                <Input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => onProfileFormChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <div className="border-border flex items-center justify-between rounded-md border p-3">
                  <span className="text-foreground">
                    {userProfile?.phone || "Not provided"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-foreground flex items-center gap-2 text-sm font-medium">
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
                />
              ) : (
                <div className="border-border flex items-center justify-between rounded-md border p-3">
                  <span className="text-foreground">
                    {userProfile?.location || "Not provided"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <label
              htmlFor="bio-textarea"
              className="text-foreground text-sm font-medium"
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
                className="min-h-[100px]"
              />
            ) : (
              <div className="border-border bg-muted/50 min-h-[100px] rounded-md border p-3">
                <p className="text-muted-foreground text-sm">
                  {userProfile?.bio ||
                    "Tell others about yourself, your art style, and what inspires you..."}
                </p>
              </div>
            )}
          </div>

          {editingProfile && (
            <div className="flex justify-end pt-4">
              <Button onClick={onSave} disabled={loading}>
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
            <Button variant="outline">
              <Lock className="mr-2 h-4 w-4" />
              Enable
            </Button>
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
            <Button variant="outline">
              <Lock className="mr-2 h-4 w-4" />
              Change
            </Button>
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
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
