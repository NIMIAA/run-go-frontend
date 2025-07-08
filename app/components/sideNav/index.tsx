"use client";
import Link from "next/link";
import { navRoutes } from "./navRoutes";
import { logout } from "@/app/utils/auth";
import { usePathname } from "next/navigation";
// import AppLogo from "../app/logo";


export default function sideNav() {
    const pathname = usePathname();
    return (
        <div>
            <Link href="" className="flex items-center justify-left">
                <p className="text-3xl font-black m-8">RUNGo</p>
            </Link>


            <nav className="text-gray-700 mx-8">
                <ul>
                    <li className="flex flex-col text-left gap-2 mt-2">
                        {navRoutes.map((route) => (
                            route.action === "logout" ? (
                                <button
                                    key={route.label}
                                    onClick={logout}
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
};

