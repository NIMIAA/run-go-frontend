"use client";
import { useState, useEffect } from "react";
import { getDriverData, Driver, setDriverData } from "@/app/utils/driverAuth";
import { ArrowLeftIcon, UserCircleIcon, CheckIcon, XMarkIcon, MapPinIcon, TruckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ProfileAvatar from "@/app/components/profile/ProfileAvatar";
import Notification from "@/app/components/ui/Notification";

export default function DriverProfilePage() {
    const [driver, setDriver] = useState<Driver | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
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
        carIdentifier: ""
    });

    useEffect(() => {
        const driverData = getDriverData();
        if (driverData) {
            setDriver(driverData);
            setEditForm({
                firstName: driverData.firstName,
                lastName: driverData.lastName,
                email: driverData.email,
                phoneNumber: driverData.phoneNumber,
                carIdentifier: driverData.carIdentifier
            });
        }
        setIsLoading(false);
    }, []);

    const handleSave = () => {
        if (driver) {
            const updatedDriver = {
                ...driver,
                ...editForm,
                lastUpdatedAt: new Date()
            };
            setDriverData(updatedDriver);
            setDriver(updatedDriver);
            setIsEditing(false);
            setNotification({
                type: 'success',
                message: 'Profile updated successfully!',
                isVisible: true
            });
        }
    };

    const handleCancel = () => {
        if (driver) {
            setEditForm({
                firstName: driver.firstName,
                lastName: driver.lastName,
                email: driver.email,
                phoneNumber: driver.phoneNumber,
                carIdentifier: driver.carIdentifier
            });
        }
        setIsEditing(false);
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

    if (!driver) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Driver data not found</p>
                    <Link href="/driver_dashboard/dashboard" className="text-blue-600 hover:underline">
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
                <Link href="/driver_dashboard/dashboard">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <ProfileAvatar
                                user={{
                                    id: driver.identifier,
                                    firstName: driver.firstName,
                                    lastName: driver.lastName,
                                    email: driver.email,
                                    isStudent: false,
                                    emailVerified: driver.isVerified,
                                    phoneNumber: driver.phoneNumber
                                }}
                                size="xl"
                            />
                        </div>

                        {/* Driver Info */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {driver.firstName} {driver.lastName}
                            </h2>
                            <p className="text-gray-600 mb-4">{driver.email}</p>

                            {/* Status Indicators */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${driver.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-medium">
                                        {driver.isAvailable ? 'Available' : 'Offline'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${driver.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <span className="text-sm font-medium">
                                        {driver.isVerified ? 'Verified' : 'Pending Verification'}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 mt-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{driver.completedRides}</p>
                                    <p className="text-sm text-gray-600">Completed Rides</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-yellow-500">{driver.averageRating.toFixed(1)}</p>
                                    <p className="text-sm text-gray-600">Average Rating</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">$1,250</p>
                                    <p className="text-sm text-gray-600">Total Earnings</p>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
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
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{driver.firstName}</p>
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
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{driver.lastName}</p>
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
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{driver.email}</p>
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
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{driver.phoneNumber}</p>
                            )}
                        </div>

                        {/* Car Identifier */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Car Identifier
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.carIdentifier}
                                    onChange={(e) => setEditForm({ ...editForm, carIdentifier: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{driver.carIdentifier}</p>
                            )}
                        </div>

                        {/* Driver ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Driver ID
                            </label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900 font-mono">{driver.identifier}</p>
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

                {/* Driver Statistics */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h3 className="text-xl font-semibold mb-6">Driver Statistics</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <TruckIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-blue-600">{driver.completedRides}</p>
                            <p className="text-sm text-gray-600">Total Rides</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="h-8 w-8 text-yellow-600 mx-auto mb-2 flex items-center justify-center">★</div>
                            <p className="text-2xl font-bold text-yellow-600">{driver.averageRating.toFixed(1)}</p>
                            <p className="text-sm text-gray-600">Average Rating</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <MapPinIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-600">6.5h</p>
                            <p className="text-sm text-gray-600">Online Today</p>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
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

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">Verification Status</h4>
                                <p className="text-sm text-gray-600">
                                    {driver.isVerified ? "Account verified" : "Account pending verification"}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${driver.isVerified
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {driver.isVerified ? 'Verified' : 'Pending'}
                            </span>
                        </div>

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