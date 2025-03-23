import Image from "next/image";
import Navbar from "./components/nav";
import Link from "next/link";
import { MapPinned, Car, Smile } from "lucide-react";
import Footer from "./footer/page";

export default function Home() {
  return (
    <>
      <header className="bg-black/50 bg-blend-multiply bg-cover bg-[url(/images/background/bg-3.jpg)] bg-bottom text-white h-screen">
        <nav className="bg-forground min-h-10 text-black bg-black/10 bg-blend-multiply">
          <Navbar/>
        </nav>
        <div className="mx-auto max-w-2xl py-20 sm:py-48 lg:py-56  items-center   text-white ">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
              Fast, Safe and Reliable Rides on Campus.
            </h1>
            <p className="mt-8 text-lg e font-medium text-prettysm:text-xl/8">
              Book a ride in seconds and get to your destination without tbe
              hassle
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 font-semibold text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main></main>

      <div className="h-[85vh] bg-backgroundImg bg-cover  bg-center bg-no-repeat bg-opacity-25 hidden">
        <div className=" absolute inset-0 h-[85vh]">
          <div className="relative z-10">
            <div className="flex items-center justify-center h-[50vh] px-8 md:px-16">
              <div className="text-background w-full my-auto">
                <p className="font-bold text-3xl md:text-5xl mt-24">
                  Fast, Safe and Reliable Rides on Campus.
                </p>
                <p className="text-lg md:text-xl my-4">
                  Book a ride in seconds and get to your destination without tbe
                  hassle
                </p>
                <div className="md:grid grid-cols-2 gap-2 justify-center py-4 md:w-1/3">
                  <div className="text-center mb-4">
                    <Link href="login">
                      <button className="py-4 border rounded-md w-full shadow-lg font-semibold text-lg hover:bg-hover-gold hover:text-background hover:border-none">
                        Book a ride
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <button className="py-4 border rounded-md w-full shadow-lg font-semibold text-lg hover:bg-hover-gold hover:text-background hover:border-none">
                      Become a campus driver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16">
        <p className="text-center font-medium text-3xl py-4 underline decoration-4 decoration-hover-gold">
          How it works
        </p>
        <div className="md:flex justify-center gap-4 p-8 text-center">
          <div className="flex justify-center items-center h-48 w-48 mx-16">
            <div className="border rounded-xl shadow-lg p-4">
              <div className="flex justify-center">
                <MapPinned size={48} className="text-foreground my-4" />
              </div>
              <p className="text-lg">Open the app and enter your destination</p>
            </div>
          </div>
          <div className="flex justify-center items-center h-48 w-48 mx-16">
            <div className="border rounded-xl shadow-lg p-4">
              <div className="flex justify-center">
                <Car size={48} className="text-foreground my-4" />
              </div>
              <p className="text-lg">Select a ride and confirm pickup</p>
            </div>
          </div>
          <div className="flex justify-center items-center h-48 w-48 mx-16">
            <div className="border rounded-xl shadow-lg p-4">
              <div className="flex justify-center">
                <Smile size={48} className="text-foreground my-4" />
              </div>
              <p className="text-lg">Meet your driver and enjoy the ride</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <p className="text-center font-medium text-3xl py-4 underline decoration-4 decoration-hover-gold">
          Why choose us
        </p>
        <div className="md:grid grid-rows-2 grid-flow-col gap-8 p-8 text-left">
          <div className="md:flex justify-center items-center gap-4 mb-4">
            <Image
              src="/images/reliable.jpg"
              alt="Reliable"
              width={300}
              height={300}
              className="rounded-xl"
            />
            <div className="my-2">
              <p className="text-lg font-semibold">Fast and reliable</p>
              <p className="text-md">
                Easily book a ride with just a few taps. No more waiting—get a
                ride within minutes, right from your campus.
              </p>
            </div>
          </div>
          <div className="md:flex justify-center items-center gap-4 mb-4">
            <Image
              src="/images/affordable.jpg"
              alt="Reliable"
              width={300}
              height={300}
              className="rounded-xl"
            />
            <div className="my-2">
              <p className="text-lg font-semibold">Affordable Rides</p>
              <p className="text-md">
                Student-friendly pricing with no hidden charges. Enjoy
                cost-effective rides across campus.
              </p>
            </div>
          </div>
          <div className="md:flex justify-center items-center gap-4 mb-4 mb-4">
            <Image
              src="/images/secure.jpg"
              alt="Reliable"
              width={300}
              height={300}
              className="rounded-xl"
            />
            <div className="my-2">
              <p className="text-lg font-semibold">Safe & Secure</p>
              <p className="text-md">
                All drivers are verified and trained to ensure a safe ride.
                Real-time tracking and emergency support provide extra security.
              </p>
            </div>
          </div>
          <div className="md:flex justify-center items-center gap-4 mb-4">
            <Image
              src="/images/wide.jpg"
              alt="Reliable"
              width={300}
              height={300}
              className="rounded-xl"
            />
            <div className="my-2">
              <p className="text-lg font-semibold">Campus-Wide Coverage</p>
              <p className="text-md">
                Rides available at all key locations, including hostels, lecture
                halls, and libraries. Never worry about getting around campus
                again!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
