"use client";
import { useState, useEffect } from "react";
import { getDriverData, Driver, toggleDriverAvailability, updateDriverLocation } from "@/app/utils/driverAuth";
import {
    ChevronRightIcon,
    MapPinIcon,
    ClockIcon,
    StarIcon,
    CurrencyDollarIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";
import ProfileAvatar from "@/app/components/profile/ProfileAvatar";

export default function DriverDashboardPage() {
    const [driver, setDriver] = useState<Driver | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

    useEffect(() => {
        const driverData = getDriverData();
        setDriver(driverData);
        setIsLoading(false);

        // Request location permission and start tracking
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    updateDriverLocation(latitude, longitude);
                    setDriver(prev => prev ? {
                        ...prev,
                        currentLatitude: latitude,
                        currentLongitude: longitude
                    } : null);
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );

            // Watch for location changes
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    updateDriverLocation(latitude, longitude);
                    setDriver(prev => prev ? {
                        ...prev,
                        currentLatitude: latitude,
                        currentLongitude: longitude
                    } : null);
                },
                (error) => {
                    console.error('Error watching location:', error);
                }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    const handleAvailabilityToggle = () => {
        if (!driver) return;

        setIsTogglingAvailability(true);
        const newAvailability = !driver.isAvailable;

        // Simulate API call delay
        setTimeout(() => {
            toggleDriverAvailability(newAvailability);
            setDriver(prev => prev ? { ...prev, isAvailable: newAvailability } : null);
            setIsTogglingAvailability(false);
        }, 1000);
    };

    const getDriverDisplayName = () => {
        if (!driver) return "Driver";
        return `${driver.firstName} ${driver.lastName}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Driver data not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-8">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col justify-center items-start mt-8">
                    <p className="text-4xl font-bold">Welcome back, {getDriverDisplayName()}</p>
                    <p className="text-gray-500 mt-2">Ready to hit the road?</p>
                </div>

                {/* Availability Toggle */}
                <div className="mt-8">
                    <button
                        onClick={handleAvailabilityToggle}
                        disabled={isTogglingAvailability}
                        className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${driver.isAvailable
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isTogglingAvailability ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : driver.isAvailable ? (
                            <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                            <XCircleIcon className="h-5 w-5" />
                        )}
                        {isTogglingAvailability
                            ? 'Updating...'
                            : driver.isAvailable
                                ? 'Available'
                                : 'Go Online'
                        }
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {/* Today's Earnings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                            <p className="text-2xl font-bold text-gray-900">$45.50</p>
                        </div>
                        <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                {/* Completed Rides */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed Rides</p>
                            <p className="text-2xl font-bold text-gray-900">{driver.completedRides}</p>
                        </div>
                        <TruckIcon className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                {/* Average Rating */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Average Rating</p>
                            <p className="text-2xl font-bold text-gray-900">{driver.averageRating.toFixed(1)}</p>
                        </div>
                        <StarIcon className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>

                {/* Online Hours */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Online Hours</p>
                            <p className="text-2xl font-bold text-gray-900">6.5h</p>
                        </div>
                        <ClockIcon className="h-8 w-8 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="col-span-2 grid grid-rows-2 gap-6">
                    {/* Active Rides */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Active Rides</h2>
                        <div className="text-center py-8">
                            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No active rides at the moment</p>
                            <p className="text-sm text-gray-500 mt-2">You'll see ride requests here when available</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Ride completed</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                                <p className="text-sm font-semibold text-green-600">+$12.50</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">New review received</p>
                                    <p className="text-xs text-gray-500">4 hours ago</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <StarIcon className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm font-semibold">5.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-span-1 space-y-6">
                    {/* Location Status */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Location Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="h-5 w-5 text-green-600" />
                                <span className="text-sm text-gray-700">Location tracking active</span>
                            </div>
                            {driver.currentLatitude && driver.currentLongitude ? (
                                <div className="text-xs text-gray-500">
                                    Lat: {driver.currentLatitude.toFixed(4)}<br />
                                    Lng: {driver.currentLongitude.toFixed(4)}
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500">Getting location...</div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <div className="flex items-center gap-2">
                                    <TruckIcon className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-medium">View Ride History</span>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                <div className="flex items-center gap-2">
                                    <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                                    <span className="text-sm font-medium">View Earnings</span>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                <div className="flex items-center gap-2">
                                    <StarIcon className="h-5 w-5 text-purple-600" />
                                    <span className="text-sm font-medium">View Reviews</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 