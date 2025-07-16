import React, { useEffect, useState } from "react";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface Driver {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    identifier: string;
    profileImageUrl?: string;
}

interface Ride {
    identifier: string;
    userIdentifier: string;
    driverIdentifier: string;
    pickupLocation: string;
    destination: string;
    pickupTime: string;
    status: string;
    price?: number;
    driver?: Driver;
    userStartAcknowledged?: boolean; // <-- Added field
    driverStartAcknowledged?: boolean; // <-- Added field
}

const RideDetailsModal: React.FC<{
    ride: Ride | null;
    onClose: () => void;
}> = ({ ride, onClose }) => {
    if (!ride) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Ride Details</h2>
                {/* Always show pickup, destination, pickup time, and price at the top */}
                <div className="mb-4 p-4 rounded-lg bg-gray-50 border flex flex-col gap-2">
                    <div><span className="font-medium text-gray-700">Pickup:</span> {ride.pickupLocation}</div>
                    <div><span className="font-medium text-gray-700">Destination:</span> {ride.destination}</div>
                    <div><span className="font-medium text-gray-700">Pickup Time:</span> {ride.pickupTime ? new Date(ride.pickupTime).toLocaleString() : 'N/A'}</div>
                    <div><span className="font-medium text-gray-700">Price:</span> {ride.price !== undefined ? `₦${ride.price.toLocaleString()}` : 'N/A'}</div>
                </div>
                <div className="flex flex-col items-center mb-4">
                    {ride.driver?.profileImageUrl ? (
                        <img
                            src={`${API_BASE_URL}${ride.driver.profileImageUrl}`}
                            alt="Driver Profile"
                            className="w-20 h-20 rounded-full object-cover border mb-2"
                            crossOrigin="anonymous"
                            onError={e => { e.currentTarget.src = '/default-profile.png'; }}
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600 mb-2">
                            {ride.driver ? `${ride.driver.firstName[0]}${ride.driver.lastName[0]}`.toUpperCase() : "?"}
                        </div>
                    )}
                    <div className="text-center">
                        <div className="font-semibold text-lg">
                            {ride.driver ? `${ride.driver.firstName} ${ride.driver.lastName}` : 'N/A'}
                        </div>
                        <div className="text-gray-500 text-sm">{ride.driver?.phoneNumber || 'N/A'}</div>
                        <div className="text-gray-400 text-xs">Driver ID: {ride.driver?.identifier || 'N/A'}</div>
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-gray-700">Status:</span> <span className={`font-semibold ${ride.status === 'accepted' ? 'text-green-700' :
                        ride.status === 'pending' ? 'text-yellow-700' :
                            ride.status === 'completed' ? 'text-blue-700' :
                                'text-gray-700'
                        }`}>{ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}</span></div>
                    <div><span className="font-medium text-gray-700">Ride ID:</span> {ride.identifier}</div>
                </div>
            </div>
        </div>
    );
};

const UpcomingRidesTab: React.FC = () => {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
    // Per-ride button state
    const [startLoading, setStartLoading] = useState<{ [id: string]: boolean }>({});
    const [startError, setStartError] = useState<{ [id: string]: string | null }>({});
    const [acknowledged, setAcknowledged] = useState<{ [id: string]: boolean }>({});
    // Complete ride state
    const [completeLoading, setCompleteLoading] = useState<{ [id: string]: boolean }>({});
    const [completeError, setCompleteError] = useState<{ [id: string]: string | null }>({});
    // Cancel ride state
    const [cancelLoading, setCancelLoading] = useState<{ [id: string]: boolean }>({});
    const [cancelError, setCancelError] = useState<{ [id: string]: string | null }>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    const fetchRides = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
            if (!token) throw new Error("User not authenticated");
            let userIdentifier = "";
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                userIdentifier = payload.userId || payload.userIdentifier || "";
            } catch {
                throw new Error("Invalid token format");
            }
            if (!userIdentifier) throw new Error("User identifier not found in token");
            const url = `${API_BASE_URL}/v1/booking/user-upcoming-rides/${userIdentifier}`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`Failed to fetch upcoming rides: ${res.status}`);
            const data = await res.json();
            // Debug log
            console.log('Upcoming rides API response:', data);
            const safeArray: Ride[] = Array.isArray(data) ? data : (Array.isArray(data.rides) ? data.rides : []);
            setRides(safeArray);
            // Initialize acknowledged state from API
            const ackObj: { [id: string]: boolean } = {};
            safeArray.forEach(ride => {
                ackObj[ride.identifier] = !!ride.userStartAcknowledged;
            });
            setAcknowledged(ackObj);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    // Show toast for 2 seconds when successMessage changes
    useEffect(() => {
        if (successMessage) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
                setSuccessMessage(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Cancel ride handler
    const handleCancelRide = async (rideIdentifier: string) => {
        setCancelLoading(prev => ({ ...prev, [rideIdentifier]: true }));
        setCancelError(prev => ({ ...prev, [rideIdentifier]: null }));
        setSuccessMessage(null);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
            if (!token) throw new Error("User not authenticated");
            let userIdentifier = "";
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                userIdentifier = payload.userId || payload.userIdentifier || "";
            } catch {
                throw new Error("Invalid token format");
            }
            if (!userIdentifier) throw new Error("User identifier not found in token");
            const res = await fetch(`${API_BASE_URL}/v1/booking/cancel-ride/${rideIdentifier}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ role: 'user', userIdentifier })
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                throw new Error(data.message || `Failed to cancel ride: ${res.status}`);
            }
            setRides(prev => prev.filter(r => r.identifier !== rideIdentifier));
            setSuccessMessage('Ride cancelled successfully.');
        } catch (err: any) {
            setCancelError(prev => ({ ...prev, [rideIdentifier]: err.message || 'Failed to cancel ride.' }));
        }
        setCancelLoading(prev => ({ ...prev, [rideIdentifier]: false }));
    };

    return (
        <div>
            <RideDetailsModal ride={selectedRide} onClose={() => setSelectedRide(null)} />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Upcoming Rides</h2>
                <button
                    onClick={fetchRides}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>
            {/* Toast notification for success */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                    {successMessage}
                </div>
            )}
            {loading ? (
                <div>Loading upcoming rides...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : rides.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {rides.map((ride) => (
                        <div key={ride.identifier} className="w-full p-5 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col gap-3">
                            <div className="flex items-center gap-4 mb-2">
                                {ride.driver?.profileImageUrl ? (
                                    <img
                                        src={`${API_BASE_URL}${ride.driver.profileImageUrl}`}
                                        alt="Driver Profile"
                                        className="w-14 h-14 rounded-full object-cover border"
                                        crossOrigin="anonymous"
                                        onError={e => { e.currentTarget.src = '/default-profile.png'; }}
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                                        {ride.driver ? `${ride.driver.firstName[0]}${ride.driver.lastName[0]}`.toUpperCase() : "?"}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-lg truncate">
                                        {ride.driver ? `${ride.driver.firstName} ${ride.driver.lastName}` : 'N/A'}
                                    </div>
                                    <div className="text-gray-500 text-sm truncate">{ride.driver?.phoneNumber || 'N/A'}</div>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${ride.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        ride.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            ride.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 text-sm">
                                <div><span className="font-medium text-gray-700">Pickup:</span> {ride.pickupLocation}</div>
                                <div><span className="font-medium text-gray-700">Destination:</span> {ride.destination}</div>
                                <div><span className="font-medium text-gray-700">Pickup Time:</span> {ride.pickupTime ? new Date(ride.pickupTime).toLocaleString() : 'N/A'}</div>
                                <div><span className="font-medium text-gray-700">Price:</span> {ride.price !== undefined ? `₦${ride.price.toLocaleString()}` : 'N/A'}</div>
                            </div>
                            <div className="flex justify-end mt-2 gap-2">
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow"
                                    onClick={() => setSelectedRide(ride)}
                                >
                                    View Details
                                </button>
                                {/* Start Ride Button Logic */}
                                {ride.status === 'accepted' && !acknowledged[ride.identifier] && (
                                    <button
                                        className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed`}
                                        disabled={!!startLoading[ride.identifier]}
                                        onClick={async () => {
                                            setStartLoading(prev => ({ ...prev, [ride.identifier]: true }));
                                            setStartError(prev => ({ ...prev, [ride.identifier]: null }));
                                            try {
                                                const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
                                                if (!token) throw new Error("User not authenticated");
                                                console.log('[DEBUG] PATCH /v1/booking/start-ride/' + ride.identifier, { role: 'user' });
                                                const res = await fetch(`${API_BASE_URL}/v1/booking/start-ride/${ride.identifier}`, {
                                                    method: 'PATCH',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${token}`,
                                                    },
                                                    body: JSON.stringify({ role: 'user' })
                                                });
                                                const data = await res.json();
                                                console.log('[DEBUG] PATCH response:', data);
                                                if (!res.ok) {
                                                    throw new Error(data.message || `Failed to start ride: ${res.status}`);
                                                }
                                                setAcknowledged(prev => ({ ...prev, [ride.identifier]: true }));
                                                // Fetch rides again to update UI and log new state
                                                await fetchRides();
                                            } catch (err: any) {
                                                setStartError(prev => ({ ...prev, [ride.identifier]: err.message || 'Failed to start ride.' }));
                                            }
                                            setStartLoading(prev => ({ ...prev, [ride.identifier]: false }));
                                        }}
                                    >
                                        {startLoading[ride.identifier] ? 'Starting...' : 'Start Ride'}
                                    </button>
                                )}
                                {/* Complete Ride Button Logic */}
                                {ride.status === 'started' && (
                                    <button
                                        className={`px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed`}
                                        disabled={!!completeLoading[ride.identifier]}
                                        onClick={async () => {
                                            setCompleteLoading(prev => ({ ...prev, [ride.identifier]: true }));
                                            setCompleteError(prev => ({ ...prev, [ride.identifier]: null }));
                                            try {
                                                const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
                                                if (!token) throw new Error("User not authenticated");
                                                console.log('[DEBUG] PATCH /v1/booking/complete-ride/' + ride.identifier, { role: 'user' });
                                                const res = await fetch(`${API_BASE_URL}/v1/booking/complete-ride/${ride.identifier}`, {
                                                    method: 'PATCH',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${token}`,
                                                    },
                                                    body: JSON.stringify({ role: 'user' })
                                                });
                                                const data = await res.json();
                                                console.log('[DEBUG] PATCH response:', data);
                                                if (!res.ok) {
                                                    throw new Error(data.message || `Failed to complete ride: ${res.status}`);
                                                }
                                                setSuccessMessage('Ride completed successfully.');
                                                await fetchRides();
                                            } catch (err: any) {
                                                setCompleteError(prev => ({ ...prev, [ride.identifier]: err.message || 'Failed to complete ride.' }));
                                            }
                                            setCompleteLoading(prev => ({ ...prev, [ride.identifier]: false }));
                                        }}
                                    >
                                        {completeLoading[ride.identifier] ? 'Completing...' : 'Complete Ride'}
                                    </button>
                                )}
                                {/* Cancel Ride Button (backend) */}
                                {(ride.status === 'accepted' || ride.status === 'started') && (
                                    <button
                                        className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed`}
                                        disabled={!!cancelLoading[ride.identifier]}
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to cancel this ride?')) {
                                                handleCancelRide(ride.identifier);
                                            }
                                        }}
                                    >
                                        {cancelLoading[ride.identifier] ? 'Cancelling...' : 'Cancel Ride'}
                                    </button>
                                )}
                                {/* Show message if acknowledged */}
                                {ride.status === 'accepted' && acknowledged[ride.identifier] && (
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">Waiting for driver to start ride…</span>
                                )}
                            </div>
                            {/* Error message for Start Ride */}
                            {startError[ride.identifier] && <div className="text-red-500 text-sm mt-1">{startError[ride.identifier]}</div>}
                            {/* Error message for Complete Ride */}
                            {completeError[ride.identifier] && <div className="text-red-500 text-sm mt-1">{completeError[ride.identifier]}</div>}
                            {/* Error message for Cancel Ride */}
                            {cancelError[ride.identifier] && <div className="text-red-500 text-sm mt-1">{cancelError[ride.identifier]}</div>}
                            {/* Debug Info */}
                            <div className="mt-2 text-xs text-gray-500">
                                <div><b>Booking ID:</b> {ride.identifier}</div>
                                <div><b>Status:</b> {ride.status}</div>
                                <div><b>User Acknowledged:</b> {ride.userStartAcknowledged ? 'Yes' : 'No'}</div>
                                <div><b>Driver Acknowledged:</b> {ride.driverStartAcknowledged ? 'Yes' : 'No'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No upcoming rides.</p>
                    <p className="text-sm mt-1">Your upcoming rides will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default UpcomingRidesTab; 