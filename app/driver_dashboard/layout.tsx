import React from 'react';
import DriverSideNav from '../components/sideNav/DriverSideNav';
import DriverProtectedRoute from '../components/auth/DriverProtectedRoute';

export default function DriverDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DriverProtectedRoute>
            <div>
                <div className="flex flex-row h-screen bg-gray-100">
                    <div className="w-1/5 bg-white shadow-md">
                        <DriverSideNav />
                    </div>
                    <div className="w-4/5 p-4">{children}</div>
                </div>
            </div>
        </DriverProtectedRoute>
    );
}; 