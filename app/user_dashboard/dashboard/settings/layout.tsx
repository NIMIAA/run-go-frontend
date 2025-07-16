"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link
                                href="/user_dashboard/dashboard"
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                Back to Dashboard
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    );
} 