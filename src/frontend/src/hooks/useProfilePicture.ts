import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export const useProfilePicture = () => {
  const { user, updateUser } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string>("");

  useEffect(() => {
    if (user?.picture) {
      setProfilePicture(user.picture);
    }
  }, [user?.picture]);

  const updateProfilePicture = (newPictureUrl: string) => {
    if (user) {
      const updatedUser = { ...user, picture: newPictureUrl };
      updateUser(updatedUser);
      setProfilePicture(newPictureUrl);
    }
  };

  return {
    profilePicture: profilePicture || user?.picture || "",
    updateProfilePicture,
  };
};
