"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { routes } from "./routes";
import AppLogo from "../app/logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-transparent text-background px-8 md:px-16 py-4 flex justify-between items-center">
      <div className="">
        <Link href="/">
          <AppLogo />
        </Link>
      </div>
      <div className="hidden md:block">
        {routes.map((route) => (
          <Link
            href={route.path}
            className="font-semibold text-lg px-8 py-2 hover:bg-hover-gold rounded-sm capitalize"
            key={route.path}
          >
            {" "}
            {route.label}{" "}
          </Link>
        ))}
      </div>

      <div className="hidden font-medium md:block">
        <Link
          href="login"
          className="px-4 py-2 mr-4 hover:bg-hover-gold rounded-sm transition-all duration-75"
        >
          Log In
        </Link>
        <Link
          href="signup"
          className="px-4 py-2 bg-background text-foreground hover:bg-hover-gold hover:text-background rounded-sm"
        >
          Sign Up
        </Link>
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          {isOpen ? (
            <X size={32} className="text-background" />
          ) : (
            <Menu size={32} className="text-background" />
          )}
        </button>
      </div>
      {isOpen && (
        <ul className="md:hidden bg-foreground py-4 space-y-4 w-3/4 h-[100vh] absolute top-0 left-0 flex justify-left items-start">
          <div className="px-8 w-full">
            <Link href="/">
              <AppLogo />
            </Link>
            {routes.map((route) => (
              <>
                <li>
                  <Link
                    href={route.path}
                    className="block p-2 pb-4 text-xl border-b capitalize"
                  >
                    {route.label}
                  </Link>
                </li>
              </>
            ))}
          </div>
        </ul>
      )}
    </nav>
  );
}
