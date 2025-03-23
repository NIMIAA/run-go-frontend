import Image from "next/image";
import Navbar from "./components/nav";
import { MapPinned, Car, Smile } from "lucide-react";
import Footer from "./components/app/footer";
import { MapPinIcon, UsersIcon, FaceSmileIcon} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <>
      <header className="bg-black/50 bg-blend-multiply bg-cover bg-[url(/images/background/bg-3.jpg)] bg-bottom text-white h-screen">
        <nav className="bg-forground min-h-10 text-black bg-black/5 bg-blend-multiply">
          <Navbar />
        </nav>
        <div className="mx-auto max-w-2xl py-20 sm:py-32 lg:py-48  items-center   text-white ">
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
                className=" bg-hover-gold text-white rounded  px-6 py-3"
              >
                Get started
              </a>
              <a
                href="#"
                className="text-sm/6 font-semibold text-white rounded  px-6 border-white border py-3 "
              >
                Become a driver<span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8 ">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance mb-4">
              How it works?
            </p>
          </div>
          <div className="md:flex justify-center gap-4 p-8 text-center">
            <div className="flex justify-center items-center">
              <div className="flex flex-col justify-center items-center gap-y-4">
                <div className="bg-yellow-500 size-20 p-6 rounded  text-center shadow-xl text-white shadow-yellow-500/30">
                  <MapPinIcon />
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-3xl lg:text-balance">
                  Select a destination
                </p>
                <p className="text-lg w-[80%]">
                  Open the app and enter your destination
                </p>
              </div>
            </div>
            <div className="md:flex justify-center gap-4 p-8 text-center">
              <div className="flex justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-y-4">
                  <div className="bg-violet-500 size-20 p-6 rounded  text-center shadow-xl text-white shadow-violet-500/30">
                    <UsersIcon />
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-3xl lg:text-balance">
                    Choose a driver
                  </p>
                  <p className="text-lg w-[80%]">
                    Meet your driver and enjoy the ride
                  </p>
                </div>
              </div>
            </div>
            <div className="md:flex justify-center gap-4 p-8 text-center">
              <div className="flex justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-y-4">
                  <div className="bg-lightBlue-500 size-20 p-6 rounded  text-center shadow-xl text-white shadow-lightBlue-500/30">
                    <FaceSmileIcon/>
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-3xl lg:text-balance">
                    Enjoy your ride
                  </p>
                  <p className="text-lg w-[80%]">
                    Meet your driver and enjoy the ride
                  </p>
                </div>
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
                  Real-time tracking and emergency support provide extra
                  security.
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
                  Rides available at all key locations, including hostels,
                  lecture halls, and libraries. Never worry about getting around
                  campus again!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
