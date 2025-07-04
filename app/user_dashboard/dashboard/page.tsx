import { ChevronRightIcon,ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="mx-8">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col justify-center items-start mt-8">
                <p className="text-4xl font-bold">Welcome, User</p>
                <p className="text-gray-500 mt-2">Here&apos;s what&apos;s happening with your account today!</p>
                </div>
                <div className="cursor-pointer mt-8 flex flex-row items-center justify-between gap-2">
                    <div className="text-sm flex flex-row items-center justify-center">
                        <div className="mr-2">
                            <Image src="/user.png" alt="" width={10} height={10} className="border rounded-full" />
                            
                        </div>
                        <div className="flex flex-col items-start justify-center">
                        <p className="font-semibold">John Doe</p>
                        <p className="text-xs">johndoe@gmail.com</p>
                        </div>
                        
                    </div>
                    <div>
                        <ChevronDownIcon className="size-4 text-gray-500 ml-2" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="col-span-2 grid grid-rows-5 gap-4 mt-8">
                    <div className="row-span-1 flex flex-row gap-4">
                        <div className="bg-white shadow-md rounded-lg p-4 w-1/2">
                            <h2 className="text-xl font-bold">Upcoming Rides</h2>
                            <p>No upcoming rides scheduled.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4 w-1/2">
                            <h2 className="text-xl font-bold">Ride History</h2>
                            <p>No history.</p>
                        </div>                                                                                          
                    </div>
                    <div className="row-span-4 flex flex-row gap-4">
                        <div className="bg-white shadow-md rounded-lg p-4 w-full flex flex-col items-center justify-center">
                            <div className="my-2 relative bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat w-full rounded-lg border h-full flex justify-center">
                        <Link href="/user_dashboard/dashboard/rides">
                        <button className="bg-blue-700 text-white px-6 py-2 absolute bottom-4 rounded-lg shadow-md hover:bg-blue-600 transition">
                        Book a Ride
                        </button>
                        </Link>
                            </div>
                        </div>                                                                                          
                    </div>
                </div>
            <div className="col-span-1 gap-4 mt-8 grid grid-rows-2">
                <div className="row-span-1 flex flex-row gap-4">
                <div className=" bg-white shadow-md rounded-lg p-4 w-full border-2">
                    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center h-full">
                        <h2 className="text-xl font-bold">Wallet Balance</h2>
                        <p className="text-2xl my-2">$0.00</p>
                        <div>
                            <button className="flex items-center bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition mt-2">
                                Add Funds
                                <ChevronRightIcon className="size-4 ml-1"/>
                            </button>
                        </div>
                    </div>
                </div>
                
                </div>
            
            </div>

            </div>
            
            
        </div>
    );
}