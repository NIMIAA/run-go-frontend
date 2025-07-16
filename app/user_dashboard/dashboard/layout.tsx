"use client";
import React, { useEffect, useState } from "react";
import SideNav from '../../components/sideNav';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function DashboardViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Sidebar */}
          <div className={`
              fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40
              w-64 lg:w-1/5 bg-white shadow-md transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
            <SideNav />
          </div>

          {/* Main content */}
          <div className="flex-1 lg:w-4/5 p-4 lg:p-6 min-h-screen overflow-y-auto">
            {/* Mobile header spacing */}
            <div className="lg:hidden h-16"></div>
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};