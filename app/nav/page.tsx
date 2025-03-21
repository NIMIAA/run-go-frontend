"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
// Removed incorrect import for Logo
export default function Navbar(){
  const [isOpen, setIsOpen] = useState(false);
    return(
        <nav className="bg-transparent text-background px-8 md:px-16 py-4 flex justify-between items-center">
        <div className="">
          <Link href="/">
          <Image src="/images/Logo.png" alt="logo" width={150} height={10} className=""/>
          </Link>
        </div>
        <div className="hidden md:block">
          <a href="#" className="font-semibold text-lg px-8 py-2 hover:bg-hover-gold rounded-sm">Ride</a>
          <a href="#" className="font-semibold text-lg px-8 py-2 hover:bg-hover-gold rounded-sm">Drive</a>
          <a href="#" className="font-semibold text-lg px-8 py-2 hover:bg-hover-gold rounded-sm">About</a>
          <a href="#" className="font-semibold text-lg px-8 py-2 hover:bg-hover-gold rounded-sm">Contact</a>
        </div>
      
        <div className="hidden font-medium md:block">
          <Link href="login" className="px-4 py-2 mr-4 hover:bg-hover-gold rounded-sm">Log In</Link>
          <Link href="signup" className="px-4 py-2 bg-background text-foreground hover:bg-hover-gold hover:text-background rounded-sm">Sign Up</Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
           {isOpen ? <X size={32} className="text-background"/> : <Menu size={32} className="text-background"/>}
          </button>
          </div>
          {isOpen && (
        <ul className="md:hidden bg-foreground py-4 space-y-4 w-3/4 h-[100vh] absolute top-0 left-0 flex justify-left items-start">
          <div className="px-8 w-full">
          <Link href="/">
          <Image src="/images/Logo.png" alt="logo" width={150} height={10} className=""/>
          </Link>
          <li><Link href="/features" className="block p-2 pb-4 text-xl border-b">Ride</Link></li>
          <li><Link href="/pricing" className="block p-2 pb-4 text-xl border-b">Drive</Link></li>
          <li><Link href="/pricing" className="block p-2 pb-4 text-xl border-b">About</Link></li>
          <li><Link href="/contact" className="block p-2 pb-4 text-xl border-b">Contact</Link></li>
          </div>
        </ul>
      )}
      </nav>
    );
}