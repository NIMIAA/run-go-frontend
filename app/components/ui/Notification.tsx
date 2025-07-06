"use client";
import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export interface NotificationProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Notification({
    type,
    message,
    isVisible,
    onClose,
    duration = 5000
}: NotificationProps) {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsShown(true);
            const timer = setTimeout(() => {
                setIsShown(false);
                setTimeout(onClose, 300); // Wait for fade out animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
            case 'error':
                return <XCircleIcon className="h-5 w-5 text-red-400" />;
            case 'warning':
                return <XCircleIcon className="h-5 w-5 text-yellow-400" />;
            default:
                return <CheckCircleIcon className="h-5 w-5 text-blue-400" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ${isShown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}>
            <div className={`rounded-lg border p-4 shadow-lg ${getStyles()}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={() => {
                                setIsShown(false);
                                setTimeout(onClose, 300);
                            }}
                            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 