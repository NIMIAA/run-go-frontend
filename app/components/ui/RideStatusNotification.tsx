"use client";
import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useUserSocket } from '@/app/context/UserSocketContext';

interface RideStatusNotificationProps {
    onClose?: () => void;
}

const RideStatusNotification: React.FC<RideStatusNotificationProps> = ({ onClose }) => {
    const { rideUpdates, clearRideUpdates } = useUserSocket();
    const [currentNotification, setCurrentNotification] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (rideUpdates.length > 0) {
            const latestUpdate = rideUpdates[rideUpdates.length - 1];
            setCurrentNotification(latestUpdate);
            setIsVisible(true);

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    setCurrentNotification(null);
                }, 300); // Wait for fade out animation
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [rideUpdates]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted':
                return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
            case 'rejected':
                return <XCircleIcon className="h-6 w-6 text-red-600" />;
            case 'completed':
                return <CheckCircleIcon className="h-6 w-6 text-blue-600" />;
            case 'cancelled':
                return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />;
            default:
                return <InformationCircleIcon className="h-6 w-6 text-gray-600" />;
        }
    };

    const getStatusMessage = (status: string, driverName?: string) => {
        switch (status) {
            case 'accepted':
                return driverName
                    ? `Your ride has been accepted by ${driverName}!`
                    : 'Your ride has been accepted!';
            case 'rejected':
                return 'Your ride request was declined. Please try again.';
            case 'completed':
                return 'Your ride has been completed!';
            case 'cancelled':
                return 'Your ride has been cancelled.';
            default:
                return 'Ride status updated.';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'rejected':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'completed':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'cancelled':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    if (!currentNotification || !isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div className={`
                p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out
                ${getStatusColor(currentNotification.status)}
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
            `}>
                <div className="flex items-start space-x-3">
                    {getStatusIcon(currentNotification.status)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                            {getStatusMessage(currentNotification.status, currentNotification.driverName)}
                        </p>
                        {currentNotification.message && (
                            <p className="text-xs mt-1 opacity-75">
                                {currentNotification.message}
                            </p>
                        )}
                        {currentNotification.driverName && currentNotification.status === 'accepted' && (
                            <div className="mt-2 text-xs">
                                <p><strong>Driver:</strong> {currentNotification.driverName}</p>
                                {currentNotification.driverPhone && (
                                    <p><strong>Phone:</strong> {currentNotification.driverPhone}</p>
                                )}
                                {currentNotification.carDetails && (
                                    <p><strong>Car:</strong> {currentNotification.carDetails}</p>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => {
                                setCurrentNotification(null);
                            }, 300);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XCircleIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RideStatusNotification; 