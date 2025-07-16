"use client";
import { useState, useEffect } from "react";
import { getDriverAuthToken, getDriverData, Driver } from "@/app/utils/driverAuth";
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
    identifier: string; // Booking identifier
    userIdentifier?: string;
    driverIdentifier?: string;
    pickupLocation: string;
    dropoffLocation?: string;
    destination?: string;
    estimatedAmount?: number;
    amountPaid?: number; // <-- Add this line
    status: string;
    requestTime?: string;
    user?: {
        firstName?: string;
        lastName?: string;
    };
    driverStartAcknowledged?: boolean;
    userStartAcknowledged?: boolean;
    // Add any other fields as needed
}

export default function DriverRidesPage() {
    const [driver, setDriver] = useState<Driver | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
    const [pendingRides, setPendingRides] = useState<RideRequest[]>([]);
    const [activeRides, setActiveRides] = useState<RideRequest[]>([]);
    const [loadingRides, setLoadingRides] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [startLoading, setStartLoading] = useState<{ [id: string]: boolean }>({});
    const [startError, setStartError] = useState<{ [id: string]: string | null }>({});
    const [completeLoading, setCompleteLoading] = useState<{ [id: string]: boolean }>({});
    const [completeError, setCompleteError] = useState<{ [id: string]: string | null }>({});

    useEffect(() => {
        const driverData = getDriverData();
        setDriver(driverData);
        setIsLoading(false);
    }, []);

    // Fetch rides function (named, so it can be called after accept/reject)
    const fetchRides = async () => {
        setLoadingRides(true);
        setError(null);
        const token = getDriverAuthToken();
        const driverData = getDriverData();
        if (!token || !driverData) {
            setError("Driver not authenticated");
            setLoadingRides(false);
            return;
        }
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        try {
            console.log('Fetching rides for driver:', driverData);
            const res = await fetch(
                `${BASE_URL}/v1/booking/driver-requests/${driverData.identifier}?page=1&limit=10`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            const allRides: RideRequest[] = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
            setPendingRides(allRides.filter(r => r.status === 'pending'));
            setActiveRides(allRides.filter(r => r.status === 'accepted' || r.status === 'in-progress'));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoadingRides(false);
        }
    };

    // Fetch bookings function for active rides
    const fetchBooking = async () => {
        setLoadingRides(true);
        setError(null);
        const token = getDriverAuthToken();
        const driverData = getDriverData();
        if (!token || !driverData) {
            setError("Driver not authenticated");
            setLoadingRides(false);
            return;
        }
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        try {
            console.log('Fetching bookings for driver:', driverData);
            const res = await fetch(
                `${BASE_URL}/v1/booking/driver-bookings/${driverData.identifier}?page=1&limit=10`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            // Use data.bookings for the bookings array
            const allBookings: RideRequest[] = Array.isArray(data.bookings) ? data.bookings : [];
            setActiveRides(allBookings.filter(r => r.status === 'accepted' || r.status === 'in-progress' || r.status === 'started'));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoadingRides(false);
        }
    };

    // useEffect(() => {
    //     fetchRides();
    // }, []);

    // Trigger appropriate fetch function based on active tab
    useEffect(() => {
        if (activeTab === 'active') {
            fetchBooking();
        } else if (activeTab === 'pending') {
            fetchRides();
        }
    }, [activeTab]);

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

    // Accept/Reject handler
    const handleRideStatusChange = async (rideId: string, newStatus: 'accepted' | 'rejected') => {
        setActionLoading(rideId + newStatus);
        setError(null);
        const token = getDriverAuthToken();
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/v1';
        try {
            const action = newStatus === 'accepted' ? 'accept' : 'reject';
            const res = await fetch(
                `${BASE_URL}/v1/booking/respond-to-ride/${rideId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ action })
                }
            );
            if (!res.ok) throw new Error('Failed to update ride status');
            // Refresh rides
            await fetchRides();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setActionLoading(null);
        }
    };

    // Start Ride handler for driver (using booking identifier)
    const handleStartRide = async (bookingIdentifier: string) => {
        setStartLoading(prev => ({ ...prev, [bookingIdentifier]: true }));
        setStartError(prev => ({ ...prev, [bookingIdentifier]: null }));
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("driverJwtToken") : null;
            if (!token) throw new Error("Driver not authenticated");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/v1/booking/start-ride/${bookingIdentifier}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ role: 'driver' })
            });
            const data = await res.json();
            console.log('Start Ride API response:', data);
            if (!res.ok || data.success === false) {
                throw new Error(data.message || `Failed to start ride: ${res.status}`);
            }
            // Defensive check for booking object
            if (data.booking && data.booking.identifier) {
                setActiveRides(prev => prev.map(b => b.identifier === data.booking.identifier ? { ...b, ...data.booking } : b));
            } else {
                // Fallback: refresh rides from backend
                await fetchRides();
            }
        } catch (err: any) {
            setStartError(prev => ({ ...prev, [bookingIdentifier]: err.message || 'Failed to start ride.' }));
        }
        setStartLoading(prev => ({ ...prev, [bookingIdentifier]: false }));
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

    if (isLoading || loadingRides) {
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

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
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
                        activeRides.map((booking) => (
                            <div key={booking.identifier} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {/* Show userIdentifier or N/A (no user object in booking) */}
                                                {booking.userIdentifier || 'N/A'}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            ₦{booking.amountPaid?.toLocaleString?.() ?? 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 text-green-600 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Pickup</p>
                                            <p className="text-sm text-gray-600">{booking.pickupLocation}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 text-red-600 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Destination</p>
                                            <p className="text-sm text-gray-600">{booking.destination}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                        {booking.status}
                                    </span>
                                    {/* Show acknowledgement states */}
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${booking.driverStartAcknowledged ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        Driver Ack: {booking.driverStartAcknowledged ? 'Yes' : 'No'}
                                    </span>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${booking.userStartAcknowledged ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        User Ack: {booking.userStartAcknowledged ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    {/* Show Start Ride button if status is 'accepted' and driverStartAcknowledged is false */}
                                    {booking.status === 'accepted' && !booking.driverStartAcknowledged && (
                                        <button
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!!startLoading[booking.identifier]}
                                            onClick={() => handleStartRide(booking.identifier)}
                                        >
                                            {startLoading[booking.identifier] ? 'Starting...' : 'Start Ride'}
                                        </button>
                                    )}
                                    {/* Show waiting message if driver acknowledged but user hasn't */}
                                    {booking.status === 'accepted' && booking.driverStartAcknowledged && !booking.userStartAcknowledged && (
                                        <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">Waiting for user to start ride…</span>
                                    )}
                                    {/* Show Complete Ride button if status is 'started' */}
                                    {booking.status === 'started' && (
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!!completeLoading[booking.identifier]}
                                            onClick={async () => {
                                                setCompleteLoading(prev => ({ ...prev, [booking.identifier]: true }));
                                                setCompleteError(prev => ({ ...prev, [booking.identifier]: null }));
                                                try {
                                                    const token = typeof window !== "undefined" ? localStorage.getItem("driverJwtToken") : null;
                                                    if (!token) throw new Error("Driver not authenticated");
                                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/v1/booking/complete-ride/${booking.identifier}`, {
                                                        method: 'PATCH',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${token}`,
                                                        },
                                                        body: JSON.stringify({ role: 'driver' })
                                                    });
                                                    const data = await res.json();
                                                    if (!res.ok) {
                                                        throw new Error(data.message || `Failed to complete ride: ${res.status}`);
                                                    }
                                                    await fetchBooking();
                                                } catch (err: any) {
                                                    setCompleteError(prev => ({ ...prev, [booking.identifier]: err.message || 'Failed to complete ride.' }));
                                                }
                                                setCompleteLoading(prev => ({ ...prev, [booking.identifier]: false }));
                                            }}
                                        >
                                            {completeLoading[booking.identifier] ? 'Completing...' : 'Complete Ride'}
                                        </button>
                                    )}
                                </div>
                                {/* Error message for Start Ride */}
                                {startError[booking.identifier] && <div className="text-red-500 text-sm mt-1">{startError[booking.identifier]}</div>}
                                {/* Error message for Complete Ride */}
                                {completeError[booking.identifier] && <div className="text-red-500 text-sm mt-1">{completeError[booking.identifier]}</div>}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500">No active rides.</div>
                    )
                ) : (
                    pendingRides.length > 0 ? (
                        pendingRides.map((ride) => {
                            console.log('Ride object:', ride); // Debug log
                            // Determine correct fields for ID, user name, and dropoff
                            const rideId = ride.identifier || '';
                            const userName = ride.user ? `${ride.user.firstName || ''} ${ride.user.lastName || ''}`.trim() : 'N/A';
                            const dropoff = ride.destination || 'N/A';
                            return (
                                <div key={rideId} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <UserIcon className="h-8 w-8 text-blue-600" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {userName}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">
                                                ₦{ride.estimatedAmount?.toLocaleString?.() ?? 'N/A'}
                                            </p>
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
                                                <p className="text-sm text-gray-600">{dropoff}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                            {ride.status}
                                        </span>
                                        <button
                                            className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 ${actionLoading === rideId + 'accepted' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={actionLoading === rideId + 'accepted'}
                                            onClick={() => handleRideStatusChange(rideId, 'accepted')}
                                        >
                                            {actionLoading === rideId + 'accepted' ? 'Accepting...' : 'Accept'}
                                        </button>
                                        <button
                                            className={`bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 ${actionLoading === rideId + 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={actionLoading === rideId + 'rejected'}
                                            onClick={() => handleRideStatusChange(rideId, 'rejected')}
                                        >
                                            {actionLoading === rideId + 'rejected' ? 'Rejecting...' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-gray-500">No pending ride requests.</div>
                    )
                )}
            </div>
        </div>
    );
} 