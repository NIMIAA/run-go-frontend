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
                    <div className="w-1/5 bg-white shadow-md h-screen fixed left-0 top-0 z-30">
                        <DriverSideNav />
                    </div>
                    <div className="flex-1 ml-[20%] p-4 overflow-y-auto h-screen">{children}</div>
                </div>
            </div>
        </DriverProtectedRoute>
    );
}; 