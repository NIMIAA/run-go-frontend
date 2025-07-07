"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes } from "./navRoutes";
// import AppLogo from "../app/logo";

export default function sideNav() {
    const pathname = usePathname();


    return (
        <div>
        <Link href="" className="flex items-center justify-left">
          <p className="text-3xl font-black m-8">RUNGo</p>
        </Link>
        <nav className="text-gray-700 mx-8">
            <p>Main Menu</p>
            <ul>
                <li className="flex flex-col text-left gap-2 mt-2">
                    {navRoutes.map((route) => {
                        const isActive = pathname === route.path;
                        return (
                            <Link href={route.path} key={route.label}>
                                <div className={`flex flex-col justify-center h-16 px-4 rounded-lg transition duration-300 ease-in-out ${
                                    isActive 
                                        ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' 
                                        : 'hover:bg-gray-200'
                                }`}>
                                   <div className="flex items-center gap-2">
                                    <route.icon className={`h-6 w-6 ${
                                        isActive ? 'text-blue-500' : 'text-gray-500'
                                    }`} aria-hidden="true" />
                                    <span className={isActive ? 'font-semibold' : ''}>
                                        {route.label}
                                    </span>
                                   </div>
                                </div>
                            </Link>
                        );
                    })}
                </li>
            </ul>
        </nav>
        </div>
    );
};

