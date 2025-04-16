import Link from "next/link";
import Image from "next/image";
export default function Footer() {
    return (
       <div className="bg-foreground text-background p-16 md:p-10">
            <div className="">
          <Link href="/">
          <Image src="/images/Logo.png" alt="logo" width={150} height={10}/>
          </Link>
        </div>
       <div className="md:grid grid-cols-4 gap-8 mb-16">
       <div className="py-8 lg:px-8">
        <a href="#"><p className="py-2 font-semibold text-lg">Company</p></a>
        <a href="#"><p className="py-2 hover:text-hover-gold">About Us</p></a>
        <a href="#"><p className="py-2 hover:text-hover-gold">Mission</p></a>
        <a href="#"><p className="py-2 hover:text-hover-gold">Team</p></a>
       </div>
      <div className="py-8 lg:px-8">
        <p className="py-2 font-semibold text-lg">Products</p>
        <a href="#"><p className="py-2 hover:text-hover-gold">Ride</p></a>
        <a href="#"><p className="py-2 hover:text-hover-gold">Drive</p></a>
      </div>
      <div className="py-8 lg:px-8">
        <p className="py-2 font-semibold text-lg">Help Center</p>
        <a href="#"><p className="py-2 hover:text-hover-gold">FAQs and Contact Support</p></a>
        <a href="#"><p className="py-2 hover:text-hover-gold">Safety Guidelines</p></a>
        <a href="#"><p className="py-2 hover:text-hover-gold">Privacy Policies</p></a>
        
      </div>
      <div className="py-8 lg:px-8">
        <p  className="py-2 font-semibold text-lg">Follow Us</p>
        <a href="#"><p className="py-2 hover:text-hover-gold">Facebook</p></a>
        <a href="#"><p className="py-2 hover:text-hover-gold">Twitter</p></a>
        <a href="#"><p className="py-2 hover:text-hover-gold">Instagram</p></a>
       </div>
       </div>
       <div className="my-8 md:grid grid-cols-4 justify-between items-center mt-8">
         <p className="col-span-3">© 2025 RUNGo. All rights reserved</p>
         <p className="hidden md:block">Terms and Conditions</p>

       </div>
       </div>
    );
}