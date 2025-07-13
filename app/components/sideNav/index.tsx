"use client";
import Link from "next/link";
import { navRoutes } from "./navRoutes";
import { logout } from "@/app/utils/auth";
import { usePathname } from "next/navigation";

export default function sideNav() {
    const pathname = usePathname();
    return (
        <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-4 lg:p-6 border-b border-gray-200">
                <Link href="/user_dashboard/dashboard" className="flex items-center">
                    <p className="text-2xl lg:text-3xl font-black text-gray-800">RUNGo</p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 lg:p-6">
                <ul className="space-y-2">
                    {navRoutes.map((route) => (
                        route.action === "logout" ? (
                            <button
                                key={route.label}
                                onClick={logout}
                                className="w-full text-left"
                            >
                                <div className="flex items-center gap-3 p-3 lg:p-4 hover:bg-gray-100 rounded-lg transition duration-200 ease-in-out group">
                                    <route.icon className="h-5 w-5 lg:h-6 lg:w-6 text-gray-500 group-hover:text-gray-700" aria-hidden="true" />
                                    <span className="text-sm lg:text-base font-medium text-gray-700 group-hover:text-gray-900">
                                        {route.label}
                                    </span>
                                </div>
                            </button>
                        ) : (
                            <Link href={route.path} key={route.label}>
                                <div className={`
                                    flex items-center gap-3 p-3 lg:p-4 rounded-lg transition duration-200 ease-in-out group
                                    ${pathname === route.path
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }
                                `}>
                                    <route.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${pathname === route.path ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                                        }`} aria-hidden="true" />
                                    <span className={`text-sm lg:text-base font-medium ${pathname === route.path ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
                                        }`}>
                                        {route.label}
                                    </span>
                                </div>
                            </Link>
                        )
                    ))}
                </ul>
            </nav>

            {/* Mobile close button */}
            <div className="lg:hidden p-4 border-t border-gray-200">
                <button
                    onClick={() => {
                        // This will be handled by the parent component
                        const event = new CustomEvent('closeSidebar');
                        window.dispatchEvent(event);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <span className="text-sm font-medium">Close Menu</span>
                </button>
            </div>
        </div>
    );
};

