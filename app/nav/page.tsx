import Link from "next/link";
export default function Navbar(){
    return(
        <nav className="bg-foreground text-background px-16 py-4 flex justify-between items-center">
        <div className="">
          <Link href="/" className="font-bold p-4 text-xl">RUNGO</Link>
          <a href="#" className="font-semibold text-lg px-8 py-2 hover:bg-hover-gold rounded-full">Ride</a>
          <a href="#" className="font-semibold text-lg px-8 py-2 hover:bg-hover-gold rounded-full">Drive</a>
          <a href="#" className="font-semibold text-lg px-8 py-2 hover:bg-hover-gold rounded-full">About</a>
        </div>
        <div className="font-medium">
          <Link href="login" className="px-4 py-2 mr-4 hover:bg-hover-gold rounded-full">Log In</Link>
          <Link href="signup" className="px-4 py-2 bg-background text-foreground hover:bg-hover-gold hover:text-background rounded-full">Sign Up</Link>
        </div>
      </nav>
    );
}