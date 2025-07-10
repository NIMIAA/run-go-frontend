import React, { useEffect, useState } from "react";

interface Ride {
    id: string;
    driverName: string;
    driverPhone: string;
    carDetails: string;
    pickup: string;
    destination: string;
    status: string;
}

const UpcomingRidesTab: React.FC = () => {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRides = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                if (!token) throw new Error("User not authenticated");
                // Decode JWT to get userIdentifier
                let userIdentifier = "";
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    userIdentifier = payload.userIdentifier || payload.sub || "";
                } catch {
                    throw new Error("Invalid token format");
                }
                if (!userIdentifier) throw new Error("User identifier not found in token");
                const res = await fetch(`/v1/booking/user-upcoming-rides/${userIdentifier}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch upcoming rides");
                const data = await res.json();
                const safeArray: Ride[] = Array.isArray(data) ? data : [];
                setRides(safeArray);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchRides();
    }, []);

    if (loading) return <div>Loading upcoming rides...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const safeArray: Ride[] = Array.isArray(rides) ? rides : [];

    return (
        <div>
            <h2 className="text-lg font-bold mb-2">Upcoming Rides</h2>
            {safeArray.length > 0 ? (
                safeArray.map((ride) => (
                    <div key={ride.id} className="mb-4 p-3 border rounded">
                        <div>Driver: {ride.driverName} ({ride.driverPhone})</div>
                        <div>Car: {ride.carDetails}</div>
                        <div>Pickup: {ride.pickup}</div>
                        <div>Destination: {ride.destination}</div>
                        <div>Status: <span className="font-semibold">{ride.status}</span></div>
                    </div>
                ))
            ) : (
                <div>No upcoming rides.</div>
            )}
        </div>
    );
};

export default UpcomingRidesTab; 