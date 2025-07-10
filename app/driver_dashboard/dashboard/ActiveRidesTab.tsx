"use client";
import React, { useEffect, useState } from "react";

interface RideRequest {
    id: string;
    userName?: string;
    pickup: string;
    destination: string;
    estimatedAmount: number;
    requestTime: string;
    status: string;
    user?: {
        firstName?: string;
        lastName?: string;
    };
    // Add more fields as needed
}

const ActiveRidesTab: React.FC = () => {
    const [pendingRides, setPendingRides] = useState<RideRequest[]>([]);
    const [activeRides, setActiveRides] = useState<RideRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Get driver identifier from JWT
    const getDriverIdentifier = (): string | null => {
        if (typeof window === "undefined") return null;
        const token = localStorage.getItem("driverJwtToken");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.driverIdentifier || payload.sub || null;
        } catch {
            return null;
        }
    };

    const driverIdentifier = getDriverIdentifier();
    const token = typeof window !== "undefined" ? localStorage.getItem("driverJwtToken") : null;
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

    // Fetch pending and active rides
    const fetchRides = async () => {
        if (!driverIdentifier || !token) {
            setError("Driver not authenticated");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Debug logs
            console.log("Fetching rides from:", `${BASE_URL}/v1/booking/driver-requests/${driverIdentifier}?page=1&limit=10`);
            console.log("Token:", token);
            console.log("Driver Identifier:", driverIdentifier);
            // Fetch pending and active rides (same endpoint, filter by status)
            const res = await fetch(
                `${BASE_URL}/v1/booking/driver-requests/${driverIdentifier}?page=1&limit=10`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            console.log("Raw response data:", data);
            const allRides: RideRequest[] = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
            // Pending: status === 'pending'
            // Active: status === 'accepted' or 'in-progress'
            setPendingRides(allRides.filter(r => r.status === 'pending'));
            setActiveRides(allRides.filter(r => r.status === 'accepted' || r.status === 'in-progress'));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, [driverIdentifier]);

    if (loading) return <div>Loading rides...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const safePending = Array.isArray(pendingRides) ? pendingRides : [];
    const safeActive = Array.isArray(activeRides) ? activeRides : [];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Active Rides</h2>

            {/* Pending Rides */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Pending Rides</h3>
                {safePending.length > 0 ? (
                    safePending.map((ride) => (
                        <div key={ride.id} className="border rounded p-4 mb-3">
                            <div>User: {ride.userName || (ride.user ? `${ride.user.firstName || ''} ${ride.user.lastName || ''}`.trim() : 'N/A')}</div>
                            <div>Pickup: {ride.pickup}</div>
                            <div>Destination: {ride.destination}</div>
                            <div>Estimated Amount: ₦{ride.estimatedAmount}</div>
                            <div>Requested: {ride.requestTime ? new Date(ride.requestTime).toLocaleString() : 'N/A'}</div>
                            {/* Add Accept/Decline buttons here if needed */}
                        </div>
                    ))
                ) : (
                    <div>No pending ride requests.</div>
                )}
            </div>

            {/* Active Rides */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Active Rides</h3>
                {safeActive.length > 0 ? (
                    safeActive.map((ride) => (
                        <div key={ride.id} className="border rounded p-4 mb-3">
                            <div>User: {ride.userName || (ride.user ? `${ride.user.firstName || ''} ${ride.user.lastName || ''}`.trim() : 'N/A')}</div>
                            <div>Pickup: {ride.pickup}</div>
                            <div>Destination: {ride.destination}</div>
                            <div>Status: <span className="font-semibold">{ride.status}</span></div>
                        </div>
                    ))
                ) : (
                    <div>No active rides.</div>
                )}
            </div>
        </div>
    );
};

export default ActiveRidesTab; 