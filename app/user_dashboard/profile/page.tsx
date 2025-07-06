"use client";
import { useState, useEffect } from "react";
import { getUserData, User, setUserData } from "@/app/utils/auth";
import { getUserProfile, deleteProfileImage, ProfileData } from "@/app/utils/api";
import { ArrowLeftIcon, UserCircleIcon, CameraIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ProfileImageUpload from "@/app/components/profile/ProfileImageUpload";
import ProfileAvatar from "@/app/components/profile/ProfileAvatar";
import Notification from "@/app/components/ui/Notification";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
        isVisible: boolean;
    }>({
        type: 'success',
        message: '',
        isVisible: false
    });
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        matricNumber: ""
    });

    useEffect(() => {
        const userData = getUserData();
        if (userData) {
            setUser(userData);
            setEditForm({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                matricNumber: userData.matricNumber || ""
            });
        }

        // Load profile data from backend
        loadProfileData();
        setIsLoading(false);
    }, []);

    const loadProfileData = async () => {
        setIsLoadingProfile(true);
        try {
            const response = await getUserProfile();
            if (response.success && response.data) {
                setProfileData(response.data);
                if (response.data.profileImageUrl) {
                    setProfileImageUrl(`http://localhost:5000${response.data.profileImageUrl}`);
                }
            }
        } catch (error) {
            console.error('Failed to load profile data:', error);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const getUserInitials = () => {
        if (!user) return "U";
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    };

    const handleSave = () => {
        if (user) {
            const updatedUser = {
                ...user,
                ...editForm
            };
            setUserData(updatedUser);
            setUser(updatedUser);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setEditForm({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                matricNumber: user.matricNumber || ""
            });
        }
        setIsEditing(false);
    };

    const handleImageUpload = (imageUrl: string) => {
        setProfileImageUrl(imageUrl);
        // Refresh profile data to get updated information
        loadProfileData();
    };

    const handleImageRemove = async () => {
        try {
            await deleteProfileImage();
            setProfileImageUrl(null);
            // Refresh profile data
            loadProfileData();
            setNotification({
                type: 'success',
                message: 'Profile image removed successfully!',
                isVisible: true
            });
        } catch (error) {
            console.error('Failed to remove profile image:', error);
            setNotification({
                type: 'error',
                message: 'Failed to remove profile image. Please try again.',
                isVisible: true
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">User data not found</p>
                    <Link href="/user_dashboard/dashboard" className="text-blue-600 hover:underline">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-8">
            {/* Header */}
            <div className="flex items-center gap-4 mt-8 mb-6">
                <Link href="/user_dashboard/dashboard">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <ProfileAvatar
                                user={user}
                                profileImageUrl={profileImageUrl}
                                size="xl"
                            />
                            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                                <CameraIcon className="h-4 w-4 text-gray-600" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>
                            {profileImageUrl && (
                                <button
                                    onClick={handleImageRemove}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                    title="Remove photo"
                                >
                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-600 mb-1">{user.email}</p>
                            <p className="text-gray-600 mb-1">{user.phoneNumber}</p>
                            {user.isStudent && user.matricNumber && (
                                <p className="text-blue-600 font-medium">Student • {user.matricNumber}</p>
                            )}
                            <div className="mt-4">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Image Upload Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-6">Profile Picture</h3>
                    <ProfileImageUpload
                        currentImageUrl={profileImageUrl || undefined}
                        onImageUpload={handleImageUpload}
                        onImageRemove={handleImageRemove}
                        userId={user.id}
                        user={user}
                    />
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-6">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.firstName}
                                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user.firstName}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.lastName}
                                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user.lastName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user.email}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editForm.phoneNumber}
                                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user.phoneNumber}</p>
                            )}
                        </div>

                        {/* Matric Number (for students) */}
                        {user.isStudent && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Matric Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.matricNumber}
                                        onChange={(e) => setEditForm({ ...editForm, matricNumber: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="RUN/XYZ/00/00000"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user.matricNumber || "Not provided"}</p>
                                )}
                            </div>
                        )}

                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Type
                            </label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                {user.isStudent ? "Student" : "Regular User"}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <CheckIcon className="h-4 w-4" />
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <XMarkIcon className="h-4 w-4" />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Additional Settings */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">Change Password</h4>
                                <p className="text-sm text-gray-600">Update your account password</p>
                            </div>
                            <Link href="/authentication/set-new-password" className="text-blue-600 hover:text-blue-700 font-medium">
                                Change
                            </Link>
                        </div>

                        {/* <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">Email Verification</h4>
                                <p className="text-sm text-gray-600">
                                    {user.emailVerified ? "Email verified" : "Email not verified"}
                                </p>
                            </div>
                            {!user.emailVerified && (
                                <Link href="/authentication/verify-email" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Verify
                                </Link>
                            )}
                        </div> */}

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">Account Status</h4>
                                <p className="text-sm text-gray-600">Active</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification */}
            <Notification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
} 