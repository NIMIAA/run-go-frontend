import React from 'react';
import SideNav from '../../components/sideNav';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function DashboardViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div>
        <div className="flex flex-row h-screen bg-gray-100">
          <div className="w-1/5 bg-white shadow-md">
            <SideNav />
          </div>
          <div className="w-4/5 p-4 h-screen overflow-y-auto">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
};