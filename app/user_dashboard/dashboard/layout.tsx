"use client";

import React from "react";
import { BellIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { routes } from "@/app/components/sideNav/navRoutes";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function DashboardViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="md:grid grid-cols-12 h-screen w-full">
        <nav className="  col-span-2 pt-12 relative bg-foreground/95 text-white hidden md:block">
          <ul className="flex flex-col gap-y-6 px-4">
            {routes.map((route) => {
              return (
                <li key={route.label} className="">
                  <Link
                    className={
                      route.path == pathname
                        ? "flex font-[family-name:var(--font-geist-sans)] items-center gap-x-2 prose-sm capitalize font-medium text-center py-2 px-2 transition delay-25 ease-in-out duration-200 bg-white/90 rounded-lg text-foreground"
                        : "flex font-[family-name:var(--font-geist-sans)] items-center gap-x-2 prose-sm capitalize font-medium text-center py-2 px-2 transition delay-25 ease-in-out duration-200 hover:bg-white/90 rounded-lg hover:text-foreground"
                    }
                    href={route.path}
                  >
                    {" "}
                    <route.activeIcon className="h-6 w-6" aria-hidden="true" />
                    {route.label}
                  </Link>
                </li>
              );
            })}

            <button className="position absolute bottom-10 left-4 right-4   flex font-[family-name:var(--font-geist-sans)] items-center gap-x-2 prose-sm capitalize font-medium text-center py-2 px-2 transition delay-25 ease-in-out duration-200 hover:bg-white/90 rounded-lg hover:text-foreground">
              <ArrowLeftStartOnRectangleIcon className="size-6" /> Logout
            </button>
          </ul>
        </nav>

        <main className="col-span-10 h-screen overflow-x-hidden overflow-y-scroll">
          <section
            role="header"
            className="flex justify-between align-center border-b-gray-200 border-b-[2px] max-h-24 bg-white py-4 px-4 md:px-16"
          >
            <Bars3Icon className="size-8 block sm:hidden" />
            <label className="input rounded-lg w-3/5 hover:border-foreground hover:outline-transparent focus:outline-none hidden md:block">
              <input type="search" required placeholder="Search" className="" />
            </label>
            <div className="flex items-center gap-x-2 md:gap-x-6">
              <div className="cursor-pointer">
                <BellIcon className="size-6 hidden md:block" />
              </div>
              <div className="cursor-pointer flex items-center gap-x-2">
                <div className="avatar ">
                  <div className="size-8  md:size-12 rounded-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                  <div></div>
                </div>
                <div className="hidden md:block">
                  <h6 className="-mb-2 font-medium">Alex Mane</h6>
                  <small>amane@rungo.com</small>
                </div>
              </div>
            </div>
          </section>
          <section className="py-4 px-6 mt-8 md:py-12 md:px-16 h-[90vh] overflow-y-scroll bg-white/70">
            {children}
          </section>
        </main>
      </div>
    </>
  );
}
