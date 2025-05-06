"use client";
import Link from "next/link";
import { navRoutes } from "./navRoutes";
import AppLogo from "../app/logo";


export default function sideNav () {
    return (
        <div>
        <Link href="" className="flex items-center justify-left">
          <p className="text-3xl font-black m-8">RUNGo</p>
        </Link>
        <nav className="text-gray-700 mx-8">
            <p>Main Menu</p>
            <ul>
                <li className="flex flex-col text-left gap-2 mt-2">
                    {navRoutes.map((route) => (
                        <Link href={route.path} key={route.label}>
                            <div className="flex flex-col justify-center h-16 px-4 hover:bg-gray-200 rounded-lg transition duration-300 ease-in-out">
                               <div className="flex items-center gap-2">
                                <route.icon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                                {route.label}
                               </div>
                            </div>
                        </Link>
                    ))}
                </li>
            </ul>
        </nav>
        </div>
    );
};

