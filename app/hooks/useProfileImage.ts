"use client";
import { useState, useEffect } from "react";
import { getUserData } from "@/app/utils/auth";
import { getDriverData } from "@/app/utils/driverAuth";
import { getUserProfile } from "@/app/utils/api";

export function useProfileImage() {
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProfileImage = async () => {
            try {
                setIsLoading(true);

                // Try to get user data first (for regular users)
                const userData = getUserData();
                if (userData?.identifier) {
                    const response = await getUserProfile(userData.identifier);
                    if (response.success && response.data?.profileImageUrl) {
                        setProfileImageUrl(`http://localhost:5000${response.data.profileImageUrl}?t=${Date.now()}`);
                        setIsLoading(false);
                        return;
                    }
                }

                // If no user data, try driver data
                const driverData = getDriverData();
                if (driverData?.identifier) {
                    // For now, we'll use a placeholder for drivers
                    // TODO: Implement driver profile image API when available
                    setProfileImageUrl(null);
                    setIsLoading(false);
                    return;
                }

                setProfileImageUrl(null);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load profile image:', error);
                setProfileImageUrl(null);
                setIsLoading(false);
            }
        };

        loadProfileImage();
    }, []);

    return { profileImageUrl, isLoading };
} 