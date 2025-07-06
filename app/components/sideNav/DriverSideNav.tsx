"use client";
import Link from "next/link";
import { driverNavRoutes } from "./driverNavRoutes";
import { driverLogout, getDriverData, Driver } from "@/app/utils/driverAuth";
import { useEffect, useState } from "react";
import ProfileAvatar from "../profile/ProfileAvatar";

export default function DriverSideNav() {
    const [driver, setDriver] = useState<Driver | null>(null);

    useEffect(() => {
        const driverData = getDriverData();
        setDriver(driverData);
    }, []);

    const getDriverDisplayName = () => {
        if (!driver) return "Driver";
        return `${driver.firstName} ${driver.lastName}`;
    };

    return (
        <div>
            <Link href="" className="flex items-center justify-left">
                <p className="text-3xl font-black m-8">RUNGo Driver</p>
            </Link>

            {/* Driver Profile Section */}
            <div className="mx-8 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <ProfileAvatar
                        user={driver ? {
                            id: driver.identifier,
                            firstName: driver.firstName,
                            lastName: driver.lastName,
                            email: driver.email,
                            isStudent: false,
                            emailVerified: driver.isVerified,
                            phoneNumber: driver.phoneNumber
                        } : null}
                        size="md"
                        showBorder={true}
                    />
                    <div className="flex flex-col">
                        <p className="font-semibold text-gray-800 text-sm">
                            {getDriverDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500">
                            {driver?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${driver?.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <p className="text-xs font-medium">
                                {driver?.isAvailable ? 'Available' : 'Offline'}
                            </p>
                        </div>
                        {driver && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-gray-500">★</span>
                                <p className="text-xs text-gray-600">
                                    {driver.averageRating.toFixed(1)} ({driver.completedRides} rides)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <nav className="text-gray-700 mx-8">
                <p>Driver Menu</p>
                <ul>
                    <li className="flex flex-col text-left gap-2 mt-2">
                        {driverNavRoutes.map((route) => (
                            route.action === "logout" ? (
                                <button
                                    key={route.label}
                                    onClick={driverLogout}
                                    className="w-full text-left"
                                >
                                    <div className="flex flex-col justify-center h-16 px-4 hover:bg-gray-200 rounded-lg transition duration-300 ease-in-out">
                                        <div className="flex items-center gap-2">
                                            <route.icon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                                            {route.label}
                                        </div>
                                    </div>
                                </button>
                            ) : (
                                <Link href={route.path} key={route.label}>
                                    <div className="flex flex-col justify-center h-16 px-4 hover:bg-gray-200 rounded-lg transition duration-300 ease-in-out">
                                        <div className="flex items-center gap-2">
                                            <route.icon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                                            {route.label}
                                        </div>
                                    </div>
                                </Link>
                            )
                        ))}
                    </li>
                </ul>
            </nav>
        </div>
    );
} 