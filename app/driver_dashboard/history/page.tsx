"use client";
import { useEffect, useState } from "react";
import { getDriverData } from "@/app/utils/driverAuth";
import { getDriverRideHistory } from "@/app/utils/api";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    accepted: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-gray-200 text-gray-700",
};

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    );
}

export default function RideHistoryPage() {
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [selectedRide, setSelectedRide] = useState<any | null>(null);

    useEffect(() => {
        const fetchRides = async () => {
            setLoading(true);
            setError(null);
            try {
                const driver = getDriverData();
                if (!driver?.identifier) throw new Error("Driver not found");
                const res = await getDriverRideHistory(driver.identifier, page, limit);
                setRides(res.data || []);
                setTotal(res.total || 0);
                setHasMore(res.hasMore || false);
            } catch (err: any) {
                setError(err.message || "Failed to fetch ride history");
            } finally {
                setLoading(false);
            }
        };
        fetchRides();
    }, [page, limit]);

    return (
        <div className="mx-8 mt-8">
            <h1 className="text-3xl font-bold mb-6">Ride History</h1>
            {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-red-600 text-center py-8">{error}</div>
            ) : rides.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No ride history yet. Your completed and requested rides will appear here.</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rides.map((ride) => (
                                <tr key={ride.identifier} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(ride.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{ride.pickupLocation}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{ride.destination}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">₦{ride.estimatedAmount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={ride.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="text-blue-600 hover:underline" onClick={() => setSelectedRide(ride)}>View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                        <span className="text-sm text-gray-600">Page {page} of {Math.ceil(total / limit) || 1}</span>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <button
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!hasMore}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Ride Details Modal */}
            {selectedRide && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setSelectedRide(null)}>&times;</button>
                        <h2 className="text-xl font-bold mb-4">Ride Details</h2>
                        <div className="space-y-2">
                            <div><span className="font-semibold">Pickup:</span> {selectedRide.pickupLocation}</div>
                            <div><span className="font-semibold">Destination:</span> {selectedRide.destination}</div>
                            <div><span className="font-semibold">Amount:</span> ₦{selectedRide.estimatedAmount}</div>
                            <div><span className="font-semibold">Status:</span> <StatusBadge status={selectedRide.status} /></div>
                            <div><span className="font-semibold">Requested At:</span> {new Date(selectedRide.createdAt).toLocaleString()}</div>
                            {selectedRide.respondedAt && <div><span className="font-semibold">Responded At:</span> {new Date(selectedRide.respondedAt).toLocaleString()}</div>}
                            <div><span className="font-semibold">User Identifier:</span> {selectedRide.userIdentifier}</div>
                            <div><span className="font-semibold">Ride ID:</span> {selectedRide.identifier}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 