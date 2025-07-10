"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the Notification type
interface Notification {
    id: string;
    type: "ride_accepted" | "ride_declined" | string;
    message: string;
    link: string; // e.g., "/user_dashboard/dashboard/upcoming"
}

const MessagesTab: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [notAuthenticated, setNotAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
                if (!token) {
                    setNotAuthenticated(true);
                    throw new Error("User not authenticated");
                }
                const res = await fetch("/v1/notifications/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch notifications");
                const data = await res.json();
                const safeArray: Notification[] = Array.isArray(data) ? data : [];
                setNotifications(safeArray);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    if (notAuthenticated) {
        return (
            <div>
                <p className="text-red-500">You must be logged in to view your messages.</p>
                <a href="/authentication/login" className="text-blue-600 underline">Go to Login</a>
            </div>
        );
    }

    if (loading) return <div>Loading notifications...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const safeArray: Notification[] = Array.isArray(notifications) ? notifications : [];

    return (
        <div>
            <h2 className="text-lg font-bold mb-2">Messages</h2>
            {safeArray.length > 0 ? (
                safeArray.map((notif) => (
                    <div key={notif.id} className="mb-4 p-3 border rounded">
                        <div>
                            {notif.type === "ride_accepted" && (
                                <>
                                    <span>Your ride request has been accepted by the driver.</span>
                                    <button
                                        className="ml-2 text-blue-600 underline"
                                        onClick={() => router.push("/user_dashboard/dashboard/rides")}
                                    >
                                        View Upcoming Rides
                                    </button>
                                </>
                            )}
                            {notif.type === "ride_declined" && (
                                <>
                                    <span>Your ride request was declined by the driver.</span>
                                    <button
                                        className="ml-2 text-blue-600 underline"
                                        onClick={() => router.push("/user_dashboard/dashboard/messages")}
                                    >
                                        Back to Messages
                                    </button>
                                </>
                            )}
                            {/* Fallback for other notification types */}
                            {notif.type !== "ride_accepted" && notif.type !== "ride_declined" && (
                                <span>{notif.message}</span>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div>No messages yet.</div>
            )}
        </div>
    );
};

export default MessagesTab; 