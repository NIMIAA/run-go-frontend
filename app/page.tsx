import Image from "next/image";
import Navbar from "./components/nav";
import Footer from "./components/app/footer";
import { MapPinIcon, UsersIcon, FaceSmileIcon } from "@heroicons/react/24/outline";

export default function Home() {

  return (
    <>
      <header className="bg-black/50 bg-blend-multiply bg-cover bg-[url(/images/background/bg-3.jpg)] bg-bottom text-white h-[85vh] xl:h-screen">
        <nav className="bg-forground min-h-10 text-black bg-black/5 bg-blend-multiply">
          <Navbar />
        </nav>
        <div className="mx-auto max-w-2xl py-20 sm:py-32 lg:py-48  items-center   text-white ">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
              Fast, Safe and Reliable Rides on Campus.
            </h1>
            <p className="mt-8 text-lg e font-medium text-prettysm:text-xl/8">
              Book a ride in seconds and get to your destination without the
              hassle
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <a
                href="/authentication/signup"
                className="bg-hover-gold text-white rounded-lg px-8 py-4 font-semibold text-lg w-full sm:w-auto text-center transition-all duration-300 hover:bg-yellow-600 transform hover:scale-105 shadow-lg"
              >
                Get started
              </a>
              <a
                href="/authentication/drivers-signup"
                className="text-white font-semibold rounded-lg px-8 py-4 border-2 border-white w-full sm:w-auto text-center transition-all duration-300 hover:bg-white hover:text-gray-900"
              >
                Become a driver <span aria-hidden="true">→</span>
              </a>
            </div>

          </div>
        </div>
      </header>

      <main className="xl:px-16">
        {/* How it works Section */}
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 bg-blend-multiply bg-no-repeat bg-cover bg-white bg-opacity-75 bg-center">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance mb-4 text-center">
              How it works?
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 px-4 lg:px-8">
            <div className="flex flex-col items-center text-center p-6 lg:p-8">
              <div className="bg-yellow-500 w-16 h-16 lg:w-20 lg:h-20 p-4 lg:p-6 rounded-full text-center shadow-xl text-white shadow-yellow-500/30 mb-6">
                <MapPinIcon className="w-full h-full" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">
                Select a destination
              </h3>
              <p className="text-base lg:text-lg text-gray-600 max-w-xs">
                Open the app and enter your destination
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 lg:p-8">
              <div className="bg-violet-500 w-16 h-16 lg:w-20 lg:h-20 p-4 lg:p-6 rounded-full text-center shadow-xl text-white shadow-violet-500/30 mb-6">
                <UsersIcon className="w-full h-full" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">
                Choose a driver
              </h3>
              <p className="text-base lg:text-lg text-gray-600 max-w-xs">
                Meet your driver and enjoy the ride
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 lg:p-8">
              <div className="bg-blue-500 w-16 h-16 lg:w-20 lg:h-20 p-4 lg:p-6 rounded-full text-center shadow-xl text-white shadow-blue-500/30 mb-6">
                <FaceSmileIcon className="w-full h-full" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">
                Enjoy your ride
              </h3>
              <p className="text-base lg:text-lg text-gray-600 max-w-xs">
                Meet your driver and enjoy the ride
              </p>
            </div>
          </div>
        </div>

        {/* Why choose us Section */}
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 bg-blend-multiply bg-no-repeat bg-cover bg-white bg-opacity-75 bg-center ">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance mb-4 text-center">
              Why choose us
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src="/images/reliable.jpg"
                alt="Reliable"
                width={200}
                height={200}
                className="rounded-xl w-48 h-48 object-cover"
              />
              <div className="text-center lg:text-left">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">Fast and reliable</h3>
                <p className="text-base lg:text-lg text-gray-600">
                  Easily book a ride with just a few taps. No more waiting—get a
                  ride within minutes, right from your campus.
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src="/images/affordable.jpg"
                alt="Affordable"
                width={200}
                height={200}
                className="rounded-xl w-48 h-48 object-cover"
              />
              <div className="text-center lg:text-left">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">Affordable Rides</h3>
                <p className="text-base lg:text-lg text-gray-600">
                  Student-friendly pricing with no hidden charges. Enjoy
                  cost-effective rides across campus.
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src="/images/secure.jpg"
                alt="Secure"
                width={200}
                height={200}
                className="rounded-xl w-48 h-48 object-cover"
              />
              <div className="text-center lg:text-left">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">Safe & Secure</h3>
                <p className="text-base lg:text-lg text-gray-600">
                  All drivers are verified and trained to ensure a safe ride.
                  Real-time tracking and emergency support provide extra
                  security.
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Image
                src="/images/wide.jpg"
                alt="Wide Coverage"
                width={200}
                height={200}
                className="rounded-xl w-48 h-48 object-cover"
              />
              <div className="text-center lg:text-left">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">Campus-Wide Coverage</h3>
                <p className="text-base lg:text-lg text-gray-600">
                  Rides available at all key locations, including hostels,
                  lecture halls, and libraries. Never worry about getting around
                  campus again!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Overview Section */}
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 bg-blend-multiply bg-no-repeat bg-cover bg-white bg-opacity-75 bg-center">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students and professionals who trust Rungo for their daily commute.
              Learn more about our platform and features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/about"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Learn More About Rungo
              </a>
              <a
                href="/authentication/signup"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300"
              >
                Start Riding Now
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
