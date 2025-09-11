import React, { useRef } from "react";
import { Camera, RefreshCw } from "lucide-react";
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
  const { profilePicture, generateNewAvatar, isGeneratedAvatar } =
    useProfilePicture();

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
    <Card className="overflow-hidden">
      <CardContent className="p-6 lg:p-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
          <div className="relative flex-shrink-0">
            <Avatar className="border-background h-28 w-28 border-4 shadow-lg sm:h-32 sm:w-32">
              <AvatarImage
                src={userProfile?.profile_picture || profilePicture}
                alt={user?.username}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold sm:text-2xl">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -right-1 -bottom-1 flex gap-1 sm:-right-2 sm:-bottom-2 sm:gap-2">
              <Button
                size="icon"
                variant="outline"
                className="bg-background h-8 w-8 rounded-full shadow-md hover:shadow-lg sm:h-9 sm:w-9"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="bg-background h-8 w-8 rounded-full shadow-md hover:shadow-lg sm:h-9 sm:w-9"
                onClick={generateNewAvatar}
                title="Generate new avatar"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoUpload}
            />
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                  {userProfile?.username || user?.username || "Your Name"}
                </h1>
                {isGeneratedAvatar && (
                  <Badge variant="secondary" className="text-xs">
                    Generated Avatar
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-base sm:text-lg">
                {userProfile?.email || user?.email || "your.email@example.com"}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  Digital Artist
                </Badge>
                {user?.loginMethod && (
                  <Badge variant="outline" className="text-sm">
                    {getLoginMethodLabel(user.loginMethod)}
                  </Badge>
                )}
              </div>
            </div>

            {profileStats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {profileStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="space-y-2 text-center">
                      <div className="flex items-center justify-center">
                        <div className="bg-primary/10 rounded-full p-2.5 sm:p-3">
                          <Icon className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                      </div>
                      <div className="text-foreground text-2xl font-bold sm:text-3xl">
                        {stat.value}
                      </div>
                      <div className="text-muted-foreground text-xs font-medium sm:text-sm">
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
