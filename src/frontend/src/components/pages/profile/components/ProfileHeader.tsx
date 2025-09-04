import React, { useRef } from "react";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useProfilePicture } from "@/hooks/useProfilePicture";

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

interface UserStats {
  art_sessions: number;
  nfts_owned: number;
  certificates: number;
  days_active: number;
}

interface User {
  username: string;
  email?: string;
  picture?: string;
  loginMethod?: "username" | "icp" | "google";
}

interface ProfileHeaderProps {
  user: User | null;
  userProfile: UserProfile | null;
  userStats: UserStats | null;
  uploadingPhoto: boolean;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  userProfile,
  userStats,
  uploadingPhoto,
  onPhotoUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profilePicture } = useProfilePicture();

  const getLoginMethodLabel = (method?: string) => {
    switch (method) {
      case "icp":
        return "Internet Identity";
      case "google":
        return "Google Auth";
      case "username":
        return "Username/Password";
      default:
        return "Unknown";
    }
  };

  const profileStats = userStats
    ? [
        {
          label: "Art Sessions",
          value: userStats.art_sessions.toString(),
          icon: Camera,
        },
        {
          label: "NFTs Owned",
          value: userStats.nfts_owned.toString(),
          icon: Camera,
        },
        {
          label: "Certificates",
          value: userStats.certificates.toString(),
          icon: Camera,
        },
        {
          label: "Days Active",
          value: userStats.days_active.toString(),
          icon: Camera,
        },
      ]
    : [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={userProfile?.profile_picture || profilePicture}
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
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoUpload}
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-foreground text-2xl font-bold">
                {userProfile?.username || user?.username || "Your Name"}
              </h2>
              <p className="text-muted-foreground">
                {userProfile?.email || user?.email || "your.email@example.com"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">Digital Artist</Badge>
                {user?.loginMethod && (
                  <Badge variant="outline">
                    {getLoginMethodLabel(user.loginMethod)}
                  </Badge>
                )}
              </div>
            </div>

            {profileStats.length > 0 && (
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
