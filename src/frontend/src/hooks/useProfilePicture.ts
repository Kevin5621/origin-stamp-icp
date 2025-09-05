import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { avatarService } from "@/services/avatarService";
import { backendService } from "@/services/backendService";

export const useProfilePicture = () => {
  const { user, updateUser } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [generatedAvatar, setGeneratedAvatar] = useState<string>("");

  useEffect(() => {
    const loadAvatar = async () => {
      if (user?.picture) {
        setProfilePicture(user.picture);
      } else if (user?.username && !generatedAvatar) {
        try {
          const backendAvatar = await backendService.getUserAvatar(
            user.username,
          );
          if (backendAvatar) {
            setProfilePicture(backendAvatar);
          } else {
            const avatar = avatarService.generateAvatar(user.username);
            setGeneratedAvatar(avatar);
            setProfilePicture(avatar);
          }
        } catch (error) {
          console.error("Failed to load avatar:", error);
          const avatar = avatarService.generateAvatar(user.username);
          setGeneratedAvatar(avatar);
          setProfilePicture(avatar);
        }
      }
    };

    loadAvatar();
  }, [user?.picture, user?.username, generatedAvatar]);

  const updateProfilePicture = (newPictureUrl: string) => {
    if (user) {
      const updatedUser = { ...user, picture: newPictureUrl };
      updateUser(updatedUser);
      setProfilePicture(newPictureUrl);
    }
  };

  const generateNewAvatar = async () => {
    if (user?.username) {
      const newAvatar = avatarService.generateRandomAvatar();
      setGeneratedAvatar(newAvatar);
      setProfilePicture(newAvatar);

      try {
        await backendService.updateUserAvatar(user.username, newAvatar);
      } catch (error) {
        console.error("Failed to update avatar in backend:", error);
      }
    }
  };

  const getDisplayPicture = (): string => {
    if (profilePicture) return profilePicture;
    if (user?.picture) return user.picture;
    if (generatedAvatar) return generatedAvatar;
    if (user?.username) {
      const avatar = avatarService.generateAvatar(user.username);
      setGeneratedAvatar(avatar);
      return avatar;
    }
    return "";
  };

  return {
    profilePicture: getDisplayPicture(),
    updateProfilePicture,
    generateNewAvatar,
    isGeneratedAvatar: !user?.picture && !!generatedAvatar,
  };
};
