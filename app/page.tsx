import Image from "next/image";
import Navbar from "./nav/page";
import homepageImage from "../public/images/homepage-img.png";
import Link from "next/link";
import Footer from "./footer/page";

export default function Home() {
  return (
    <div className="">
      <Navbar/>
      <main className=" h-[90vh]">
        <div className="border h-full flex justify-center items-center bg-grey-bg px-16">
          <div className="flex justify-between items-start w-full">
            
              <div className="w-1/3">
              <p className="font-bold text-5xl">Ride Around Campus, Anytime.</p>
              <p className="text-xl my-4">Sit back, relax and enjoy the ride. Your satisfaction is our priority</p>
              <div className="grid grid-cols-2 gap-2 justify-center py-4 w-full">
          <div className="text-center">
            <button className="py-4 border rounded-md w-full shadow-lg font-semibold text-lg hover:bg-hover-gold hover:text-background">Become a campus driver</button>
          </div>
          <div className="text-center">
            <Link href="login">
            <button className="py-4 border rounded-md w-full shadow-lg font-semibold text-lg hover:bg-hover-gold hover:text-background">Book a ride</button>
            </Link>
          </div>
              </div>
              </div>
        
            <Image src={homepageImage} alt="homepage" className="mr-16" />

          </div>
        </div>
        
      </main>
      <Footer/>
    </div>
  );
}
