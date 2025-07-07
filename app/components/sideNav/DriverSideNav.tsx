"use client";
import Link from "next/link";
import { driverNavRoutes } from "./driverNavRoutes";
import { driverLogout, getDriverData, Driver } from "@/app/utils/driverAuth";
import { useEffect, useState } from "react";
import ProfileAvatar from "../profile/ProfileAvatar";
import { usePathname } from "next/navigation";

export default function DriverSideNav() {
    const [driver, setDriver] = useState<Driver | null>(null);
    const pathname = usePathname();

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

            {/* Profile section removed for cleaner sidebar */}

            <nav className="text-gray-700 mx-8">
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
                                    <div className={`flex flex-col justify-center h-16 px-4 rounded-lg transition duration-300 ease-in-out ${pathname === route.path ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-200'}`}>
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