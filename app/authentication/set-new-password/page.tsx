import Link from "next/link";

import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
export default function SetPassword() {
    return (
      <div className="xl:flex">
        <div className=" w-1/2 ">
          <div className="xl:bg-black/30 w-1/2 xl:bg-[url(/images/background/passwordreset.jpg)] bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
        </div>

        <div className="h-screen flex justify-center items-center  mx-6 xl:w-1/2">
        <Link href="/">
        <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
        </Link>
        <div className="md:w-3/5 w-full">
          <div className="text-center">
            <p className="text-3xl font-semibold mb-4">Set new password</p>
            <p className="text-md text-gray-500 mb-8">Must be at least 8 characters</p>

            <div className="flex flex-col items-center justify-center my-4">
          <div className="w-full text-left text-sm font-semibold mb-2">Password</div>
          <input
              type="password"
              placeholder="********"
              className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground"
            />
          </div>
            <div className="flex flex-col items-center justify-center my-4">
          <div className="w-full text-left text-sm font-semibold mb-2">Confirm password</div>
          <input
              type="password"
              placeholder="********"
              className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground"
            />
          </div>
            <button className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105">
              Reset Password
            </button>
            {/* <div className="my-4">
                <Link href="login">
              <p className="font-bold text-sm text-black hover:text-foreground">
                Back to log in{" "} 
              </p>
                </Link>
            </div> */}
          </div>
        </div>
        </div>
      </div>
    );
  }
