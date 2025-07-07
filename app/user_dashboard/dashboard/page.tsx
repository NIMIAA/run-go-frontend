import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="mx-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-row justify-between items-center mt-8">
                <div>
                    <p className="text-4xl font-extrabold text-gray-900">Welcome, User</p>
                    <p className="text-gray-500 mt-2 text-lg">
                        Here&apos;s what&apos;s happening with your account today!
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white shadow rounded-xl px-4 py-2">
                    <Image
                        src="/user.png"
                        alt=""
                        width={36}
                        height={36}
                        className="border rounded-full"
                    />
                    <div className="flex flex-col items-start justify-center">
                        <p className="font-semibold">John Doe</p>
                        <p className="text-xs text-gray-500">johndoe@gmail.com</p>
                    </div>
                    <ChevronDownIcon className="size-5 text-gray-400 ml-2" />
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-4 gap-6 mt-10">
                {/* Left: Cards */}
                <div className="col-span-3 flex flex-col gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between min-h-[140px]">
                            <h2 className="text-lg font-bold mb-2">Upcoming Rides</h2>
                            <p className="text-gray-500">No upcoming rides scheduled.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between min-h-[140px]">
                            <h2 className="text-lg font-bold mb-2">Ride History</h2>
                            <p className="text-gray-500">No history.</p>
                        </div>
                    </div>

                    {/* Book a Ride CTA */}
                    <div className="relative rounded-2xl overflow-hidden shadow-md flex items-center min-h-[260px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200 opacity-80" />
                        <Image
                            src="/images/users-sign-up.jpg"
                            alt="Book a Ride"
                            fill
                            className="object-cover object-center opacity-60"
                            style={{ zIndex: 0 }}
                        />
                        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                            <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow">
                                Ready to go somewhere?
                            </h2>
                            <Link href="/user_dashboard/dashboard/rides">
                                <button className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition text-lg">
                                    Book a Ride
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right: Wallet & Quick Actions */}
                <div className="col-span-1 flex flex-col gap-6 mt-2">
                    {/* Wallet Card */}
                    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-2">Wallet Balance</h2>
                        <p className="text-3xl font-mono my-2 text-blue-700">₦0.00</p>
                        <button className="flex items-center bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-800 transition mt-2 font-semibold">
                            Add Funds
                            <ChevronRightIcon className="size-5 ml-1" />
                        </button>
                    </div>
                    {/* Quick Actions */}
                    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-3">
                        <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                            Share Location
                        </button>
                        <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                            Emergency Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}