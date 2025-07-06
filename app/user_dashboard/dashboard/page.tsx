"use client";
import { ChevronRightIcon, ChevronDownIcon, UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserData, User } from "@/app/utils/auth";

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userData = getUserData();
        setUser(userData);
        setIsLoading(false);
    }, []);

    const getUserDisplayName = () => {
        if (!user) return "User";
        return `${user.firstName} ${user.lastName}`;
    };

    const getUserInitials = () => {
        if (!user) return "U";
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="mx-8">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col justify-center items-start mt-8">
                    <p className="text-4xl font-bold">Welcome, {getUserDisplayName()}</p>
                    <p className="text-gray-500 mt-2">Here&apos;s what&apos;s happening with your account today!</p>
                </div>

                {/* Profile Section */}
                <div className="mt-8 relative group">
                    <div className="flex flex-row items-center justify-between gap-3 bg-white rounded-lg shadow-md p-3 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex flex-row items-center gap-3">
                            {/* Profile Picture Placeholder */}
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {getUserInitials()}
                            </div>

                            {/* User Info */}
                            <div className="flex flex-col items-start justify-center">
                                <p className="font-semibold text-gray-800">
                                    {isLoading ? "Loading..." : getUserDisplayName()}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {isLoading ? "loading@email.com" : user?.email}
                                </p>
                                {user?.isStudent && (
                                    <p className="text-xs text-blue-600 font-medium">
                                        Student • {user.matricNumber}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Dropdown Arrow */}
                        <div className="flex items-center gap-2">
                            <ChevronDownIcon className="size-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Profile Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="py-2">
                            <Link href="/user_dashboard/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <UserCircleIcon className="size-4" />
                                Profile Settings
                            </Link>
                            <Link href="/user_dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <Cog6ToothIcon className="size-4" />
                                Account Settings
                            </Link>
                            <hr className="my-1" />
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = '/authentication/login';
                                }}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="col-span-2 grid grid-rows-5 gap-4 mt-8">
                    <div className="row-span-1 flex flex-row gap-4">
                        <div className="bg-white shadow-md rounded-lg p-4 w-1/2">
                            <h2 className="text-xl font-bold">Upcoming Rides</h2>
                            <p>No upcoming rides scheduled.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4 w-1/2">
                            <h2 className="text-xl font-bold">Ride History</h2>
                            <p>No history.</p>
                        </div>
                    </div>
                    <div className="row-span-4 flex flex-row gap-4">
                        <div className="bg-white shadow-md rounded-lg p-4 w-full flex flex-col items-center justify-center">
                            <div className="my-2 relative bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat w-full rounded-lg border h-full flex justify-center">
                                <Link href="/user_dashboard/dashboard/rides">
                                    <button className="bg-blue-700 text-white px-6 py-2 absolute bottom-4 rounded-lg shadow-md hover:bg-blue-600 transition">
                                        Book a Ride
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-1 gap-4 mt-8 grid grid-rows-2">
                    <div className="row-span-1 flex flex-row gap-4">
                        <div className=" bg-white shadow-md rounded-lg p-4 w-full border-2">
                            <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center h-full">
                                <h2 className="text-xl font-bold">Wallet Balance</h2>
                                <p className="text-2xl my-2">$0.00</p>
                                <div>
                                    <button className="flex items-center bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition mt-2">
                                        Add Funds
                                        <ChevronRightIcon className="size-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>


        </div>
    );
}