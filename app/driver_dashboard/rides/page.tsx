"use client";
import { useState, useEffect } from "react";
import { getDriverData, Driver } from "@/app/utils/driverAuth";
import {
    ArrowLeftIcon,
    MapPinIcon,
    ClockIcon,
    UserIcon,
    PhoneIcon,
    CheckIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface RideRequest {
    id: string;
    passengerName: string;
    passengerPhone: string;
    pickupLocation: string;
    dropoffLocation: string;
    distance: string;
    estimatedFare: number;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled';
    requestTime: Date;
}

export default function DriverRidesPage() {
    const [driver, setDriver] = useState<Driver | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');

    // Mock ride data - replace with API calls
    const [rideRequests] = useState<RideRequest[]>([
        {
            id: "RIDE001",
            passengerName: "Sarah Johnson",
            passengerPhone: "+234 801 234 5678",
            pickupLocation: "University of Lagos, Akoka",
            dropoffLocation: "Victoria Island, Lagos",
            distance: "12.5 km",
            estimatedFare: 2500,
            status: 'pending',
            requestTime: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        },
        {
            id: "RIDE002",
            passengerName: "Michael Chen",
            passengerPhone: "+234 802 345 6789",
            pickupLocation: "Ikeja City Mall",
            dropoffLocation: "Lekki Phase 1",
            distance: "18.2 km",
            estimatedFare: 3200,
            status: 'accepted',
            requestTime: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
        }
    ]);

    useEffect(() => {
        const driverData = getDriverData();
        setDriver(driverData);
        setIsLoading(false);
    }, []);

    const handleAcceptRide = (rideId: string) => {
        // Simulate API call
        console.log(`Accepting ride: ${rideId}`);
        // Update ride status in real implementation
    };

    const handleRejectRide = (rideId: string) => {
        // Simulate API call
        console.log(`Rejecting ride: ${rideId}`);
        // Update ride status in real implementation
    };

    const handleCompleteRide = (rideId: string) => {
        // Simulate API call
        console.log(`Completing ride: ${rideId}`);
        // Update ride status in real implementation
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading rides...</p>
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

    const activeRides = rideRequests.filter(ride => ride.status === 'accepted');
    const pendingRides = rideRequests.filter(ride => ride.status === 'pending');

    return (
        <div className="mx-8">
            {/* Header */}
            <div className="flex items-center gap-4 mt-8 mb-6">
                <Link href="/driver_dashboard/dashboard">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Rides</h1>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md p-1 mb-6">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${activeTab === 'active'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Active Rides ({activeRides.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${activeTab === 'pending'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Pending Requests ({pendingRides.length})
                    </button>
                </div>
            </div>

            {/* Rides List */}
            <div className="space-y-6">
                {activeTab === 'active' ? (
                    activeRides.length > 0 ? (
                        activeRides.map((ride) => (
                            <div key={ride.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {ride.passengerName}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <PhoneIcon className="h-4 w-4" />
                                                {ride.passengerPhone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            ₦{ride.estimatedFare.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">{ride.distance}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 text-green-600 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Pickup</p>
                                            <p className="text-sm text-gray-600">{ride.pickupLocation}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 text-red-600 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Dropoff</p>
                                            <p className="text-sm text-gray-600">{ride.dropoffLocation}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <ClockIcon className="h-4 w-4" />
                                        {formatTime(ride.requestTime)}
                                    </div>
                                    <button
                                        onClick={() => handleCompleteRide(ride.id)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                    >
                                        <CheckIcon className="h-4 w-4" />
                                        Complete Ride
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="text-gray-400 mb-4">
                                <MapPinIcon className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Rides</h3>
                            <p className="text-gray-600">You don't have any active rides at the moment.</p>
                        </div>
                    )
                ) : (
                    pendingRides.length > 0 ? (
                        pendingRides.map((ride) => (
                            <div key={ride.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {ride.passengerName}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <PhoneIcon className="h-4 w-4" />
                                                {ride.passengerPhone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            ₦{ride.estimatedFare.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">{ride.distance}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 text-green-600 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Pickup</p>
                                            <p className="text-sm text-gray-600">{ride.pickupLocation}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 text-red-600 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Dropoff</p>
                                            <p className="text-sm text-gray-600">{ride.dropoffLocation}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <ClockIcon className="h-4 w-4" />
                                        {formatTime(ride.requestTime)}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleRejectRide(ride.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleAcceptRide(ride.id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="text-gray-400 mb-4">
                                <ClockIcon className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                            <p className="text-gray-600">No ride requests are waiting for your response.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
} 