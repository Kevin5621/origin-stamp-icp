import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToastContext } from "@/contexts/ToastContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { physicalArtService, profileService } from "@/services";
import { useProfilePicture } from "@/hooks/useProfilePicture";
import { PasswordConfirmationDialog } from "@/components/ui/password-confirmation-dialog";
import {
  ProfileHeader,
  ProfileSettings,
  NotificationSettingsCard,
  PrivacySettingsCard,
  ActivityFeedCard,
} from "./components";

// Backend integration types
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

interface UserStats {
  art_sessions: number;
  nfts_owned: number;
  certificates: number;
  days_active: number;
}

interface NotificationSettings {
  session_notifications: boolean;
  marketplace_updates: boolean;
  collection_alerts: boolean;
  email_digest: boolean;
}

interface PrivacySettings {
  public_profile: boolean;
  show_collection: boolean;
  activity_status: boolean;
  session_history: boolean;
}

interface ActivityItem {
  id: string;
  type: "session" | "nft" | "achievement" | "collection";
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    session_id?: string;
    nft_id?: string;
    achievement_type?: string;
  };
}

// Utility functions are included in the component implementation below

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToastContext();
  const { updateProfilePicture } = useProfilePicture();

  // State management
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    art_sessions: 0,
    nfts_owned: 0,
    certificates: 0,
    days_active: 0,
  });
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      session_notifications: true,
      marketplace_updates: true,
      collection_alerts: false,
      email_digest: true,
    });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    public_profile: true,
    show_collection: true,
    activity_status: false,
    session_history: true,
  });

  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    display_name: "",
    email: "",
    bio: "",
    location: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Load user profile from backend
  const loadUserProfile = useCallback(async () => {
    if (!user?.username) return;

    try {
      // Try to load profile from backend/localStorage first
      let loadedProfile: UserProfile | null = null;

      try {
        const backendProfile = await profileService.getUserProfile(
          user.username,
        );
        if (backendProfile) {
          // Convert backend profile to local UserProfile format
          loadedProfile = {
            username: backendProfile.username,
            display_name: backendProfile.display_name,
            email: backendProfile.email,
            bio: backendProfile.bio,
            location: backendProfile.location,
            profile_picture: user.picture || "",
            created_at: BigInt(Date.now() * 1000000),
            updated_at: BigInt(Date.now() * 1000000),
          };
        }
      } catch {
        // Could not load profile from backend
      }

      // If no profile found, create default profile
      if (!loadedProfile) {
        loadedProfile = {
          username: user.username,
          display_name: user.username, // Default to username for now
          email: user.email || "",
          bio: "Passionate digital artist exploring the intersection of technology and creativity.",
          location: "San Francisco, CA",
          profile_picture: user.picture || "",
          created_at: BigInt(Date.now() * 1000000),
          updated_at: BigInt(Date.now() * 1000000),
        };
      }

      setUserProfile(loadedProfile);

      // Initialize profile form with loaded data
      setProfileForm({
        display_name: loadedProfile.display_name || "",
        email: loadedProfile.email || "",
        bio: loadedProfile.bio || "",
        location: loadedProfile.location || "",
      });
    } catch {
      error("Failed to load profile data");
    }
  }, [user?.username, user?.email, user?.picture, error]);

  // Load user statistics
  const loadUserStats = useCallback(async () => {
    if (!user?.username) return;

    try {
      // Using mock data for now - backend integration ready for implementation
      const mockStats: UserStats = {
        art_sessions: 12,
        nfts_owned: 5,
        certificates: 8,
        days_active: 45,
      };

      setUserStats(mockStats);
    } catch {
      setUserStats({
        art_sessions: 0,
        nfts_owned: 0,
        certificates: 0,
        days_active: 0,
      });
    }
  }, [user?.username]);

  // Load recent activity
  const loadRecentActivity = useCallback(async () => {
    if (!user?.username) return;

    try {
      // Using mock data for now - backend integration ready for implementation
      const mockActivities: ActivityItem[] = [
        {
          id: "session-1",
          type: "session",
          title: "Started new art session",
          description:
            "Digital Portrait Series - exploring new techniques with digital brushes and color theory",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          metadata: { session_id: "sess_123" },
        },
        {
          id: "nft-1",
          type: "nft",
          title: "NFT Certificate Generated",
          description:
            "Abstract Digital Painting #123 - your artwork has been verified and minted as an NFT",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          metadata: { nft_id: "nft_456" },
        },
        {
          id: "achievement-1",
          type: "achievement",
          title: "First Week Complete!",
          description:
            "Congratulations on completing your first week of consistent art creation",
          timestamp: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 1 week ago
          metadata: { achievement_type: "weekly_streak" },
        },
      ];

      setRecentActivity(mockActivities);
    } catch {
      setRecentActivity([]);
    }
  }, [user?.username]);

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      if (user?.username) {
        setLoading(true);
        await Promise.all([
          loadUserProfile(),
          loadUserStats(),
          loadRecentActivity(),
        ]);
        setLoading(false);
      }
    };

    loadAllData();
  }, [user?.username, loadUserProfile, loadUserStats, loadRecentActivity]);

  // Handle photo upload
  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.username) return;

    // Validate file type
    if (!physicalArtService.validateFileType(file)) {
      error("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (max 5MB for profile photos)
    if (!physicalArtService.validateFileSize(file, 5)) {
      error("File size too large. Maximum size is 5MB for profile photos");
      return;
    }

    try {
      // Create a special session for profile photos
      const profileSessionId = `profile_${user.username}_${Date.now()}`;

      // Upload to S3
      const uploadResult = await physicalArtService.uploadPhoto(
        profileSessionId,
        file,
      );

      if (uploadResult.success && uploadResult.url) {
        // Update local state
        if (userProfile) {
          const updatedProfile = {
            ...userProfile,
            profile_picture: uploadResult.url,
          };
          setUserProfile(updatedProfile);
        }

        // Update profile picture using hook
        updateProfilePicture(uploadResult.url);

        success("Profile photo updated successfully!");
      } else {
        error(uploadResult.message || "Failed to upload profile photo");
      }
    } catch {
      error("Failed to upload profile photo");
    }
  };

  // Handle notification settings change
  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));

    // Backend integration ready for implementation
    // When backend is ready: backend.update_notification_settings(user.username, { [setting]: !notificationSettings[setting] });

    success("Notification preferences updated");
  };

  // Handle privacy settings change
  const handlePrivacyChange = (setting: keyof PrivacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));

    // Backend integration ready for implementation
    // When backend is ready: backend.update_privacy_settings(user.username, { [setting]: !privacySettings[setting] });

    success("Privacy settings updated");
  };

  // Profile editing handlers
  const handleProfileFormChange = (
    field: keyof typeof profileForm,
    value: string,
  ) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditToggle = () => {
    const formData = {
      display_name: userProfile?.display_name || "",
      email: userProfile?.email || "",
      bio: userProfile?.bio || "",
      location: userProfile?.location || "",
    };

    setProfileForm(formData);
    setEditingProfile(!editingProfile);
  };

  const handleProfileSave = async () => {
    if (!user?.username) return;

    // Validate profile data first
    const validation = profileService.validateProfileFields(profileForm);
    if (!validation.isValid) {
      error(validation.errors.join(", "));
      return;
    }

    // Show password confirmation dialog
    setShowPasswordDialog(true);
  };

  const handlePasswordConfirm = async (password: string) => {
    if (!user?.username) return;

    setProfileLoading(true);
    setShowPasswordDialog(false);

    try {
      // Update profile using the backend service
      const result = await profileService.updateProfile(
        user.username,
        password,
        profileForm,
      );

      if (result.success) {
        // Reload profile from backend to get the latest data
        await loadUserProfile();

        setEditingProfile(false);
        success("Profile updated successfully");
      } else {
        error(result.message || "Failed to update profile");
      }
    } catch {
      error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordDialog(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-8 sm:py-8 lg:px-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4 sm:mb-8">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs sm:text-sm">
            Privacy
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0 space-y-6 sm:space-y-8">
          <ProfileHeader
            user={user}
            userProfile={userProfile}
            userStats={userStats}
            uploadingPhoto={false}
            onPhotoUpload={handlePhotoUpload}
          />
          <ProfileSettings
            userProfile={userProfile}
            profileForm={{
              display_name: profileForm.display_name,
              email: profileForm.email,
              bio: profileForm.bio,
              location: profileForm.location,
            }}
            editingProfile={editingProfile}
            loading={profileLoading}
            onProfileFormChange={handleProfileFormChange}
            onEditToggle={handleEditToggle}
            onSave={handleProfileSave}
          />
        </TabsContent>

        <TabsContent
          value="notifications"
          className="mt-0 space-y-6 sm:space-y-8"
        >
          <div className="mx-auto max-w-4xl">
            <NotificationSettingsCard
              settings={notificationSettings}
              onSettingChange={handleNotificationChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="mt-0 space-y-6 sm:space-y-8">
          <div className="mx-auto max-w-4xl">
            <PrivacySettingsCard
              settings={privacySettings}
              onSettingChange={handlePrivacyChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-0 space-y-6 sm:space-y-8">
          <div className="mx-auto max-w-4xl">
            <ActivityFeedCard activities={recentActivity} isLoading={loading} />
          </div>
        </TabsContent>
      </Tabs>

      <PasswordConfirmationDialog
        isOpen={showPasswordDialog}
        onConfirm={handlePasswordConfirm}
        onCancel={handlePasswordCancel}
        title="Confirm Profile Update"
        description="Please enter your password to confirm the profile changes."
        loading={profileLoading}
      />
    </div>
  );
};
