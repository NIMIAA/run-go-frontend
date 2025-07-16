"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/app/utils/auth";

// Define the Notification type
interface Notification {
    id: string;
    type: string;
    message: string;
    link?: string;
    isRead?: boolean;
    createdAt: string;
}

const MessagesTab: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [notAuthenticated, setNotAuthenticated] = useState<boolean>(false);
    const user = getUserData();
    const userIdentifier = user?.identifier;

    // Fetch notifications for the current user and mark all as read
    const fetchNotificationsAndMarkRead = async () => {
        if (!userIdentifier) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:5000/v1/notifications/${userIdentifier}`);
            if (!res.ok) throw new Error("Failed to fetch notifications");
            const data = await res.json();
            const safeArray: Notification[] = Array.isArray(data) ? data : (Array.isArray(data.notifications) ? data.notifications : []);
            // Sort by createdAt (most recent first)
            safeArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            // Mark all unread as read in backend
            const unread = safeArray.filter(n => !n.isRead);
            if (unread.length > 0) {
                await Promise.all(
                    unread.map(n => fetch(`http://localhost:5000/v1/notifications/${n.id}/read`, { method: 'POST' }))
                );
                // Set all as read in local state
                setNotifications(safeArray.map(n => ({ ...n, isRead: true })));
            } else {
                setNotifications(safeArray);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userIdentifier) {
            setError('User identifier not found. Please log in again.');
            setLoading(false);
            return;
        }
        fetchNotificationsAndMarkRead();
        // Poll for updates every 30 seconds, always marking as read
        const interval = setInterval(fetchNotificationsAndMarkRead, 30000);
        return () => clearInterval(interval);
    }, [userIdentifier]);

    // Mark as read when viewed
    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.isRead) {
            await fetch(`http://localhost:5000/v1/notifications/${notif.id}/read`, { method: 'POST' });
            setNotifications((prev) => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
        }
        // Do not redirect, even if notif.link exists
    };

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
                    <div
                        key={notif.id}
                        className={`mb-4 p-3 border rounded cursor-pointer transition-colors ${!notif.isRead ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                        onClick={() => handleNotificationClick(notif)}
                    >
                        <div>
                            {notif.type === "ride-request-sent" && (
                                <span className="font-semibold text-green-700">{notif.message}</span>
                            )}
                            {notif.type === "ride_accepted" && (
                                <>
                                    <span>Your ride request has been accepted by the driver.</span>
                                    <button
                                        className="ml-2 text-blue-600 underline"
                                        onClick={e => { e.stopPropagation(); router.push("/user_dashboard/dashboard/rides"); }}
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
                                        onClick={e => { e.stopPropagation(); router.push("/user_dashboard/dashboard/messages"); }}
                                    >
                                        Back to Messages
                                    </button>
                                </>
                            )}
                            {/* Fallback for other notification types */}
                            {notif.type !== "ride-request-sent" && notif.type !== "ride_accepted" && notif.type !== "ride_declined" && (
                                <span>{notif.message}</span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                            <span>{new Date(notif.createdAt).toLocaleString()}</span>
                            {!notif.isRead && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-200 text-blue-800 text-xs">Unread</span>}
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