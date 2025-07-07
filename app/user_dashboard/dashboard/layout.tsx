import React from 'react';
import SideNav from '../../components/sideNav'; 

export default function DashboardViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-row h-screen bg-gray-100">
        <div className="w-1/5 bg-white shadow-md">
          <SideNav />
        </div>
        <div className="w-4/5 p-4 bg-gray-100">{children}</div>
      </div>
    </div>
  );
};