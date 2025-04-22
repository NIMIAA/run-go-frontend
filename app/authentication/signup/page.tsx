import Link from "next/link";

import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
export default function SignupPage() {
    return (
      <div className="xl:flex">
        <div className=" w-1/2 ">
          <div className="xl:bg-black/50 bg-blend-multiply w-1/2 xl:bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
        </div>

        <div className="h-screen flex justify-center items-center  mx-6 xl:w-1/2">
        <Link href="/">
        <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
        </Link>
        <div>
          <div className="text-center">
            <p className="text-3xl font-semibold mb-4">Hello, Friend</p>
            <p className="text-md text-gray-500 mb-8">Create an account to get your journey with us started</p>

            <div className="flex flex-col items-center justify-center my-4">
          <div className="w-full text-left text-sm font-semibold mb-2">Full Name</div>
          <input
              type="text"
              placeholder="John Doe"
              className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground"
            />
          </div>
          <div className="flex flex-col items-center justify-center my-4">
          <div className="w-full text-left text-sm font-semibold mb-2">Matric No.</div>
          <input
              type="text"
              placeholder="run/xyz/00/0000"
              className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground"
            />
          </div>
          <div className="flex flex-col items-center justify-center my-4">
          <div className="w-full text-left text-sm font-semibold mb-2">Password</div>
          <input
              type="text"
              placeholder="Enter your password"
              className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground"
            />
          </div>
            <button className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105">
              Sign Up
            </button>
            <div className="my-4">
                <Link href="login">
              <p>
                Have an account?{" "} <span className="font-bold text-sm text-black hover:text-foreground">Login</span>
                  
              </p>
                </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }
