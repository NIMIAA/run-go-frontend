import Link from "next/link";

import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
export default function Login() {
    return (
      <div>
      <div className="xl:flex">
        <div className=" w-1/2">
          <div className="xl:bg-black/50 bg-blend-multiply xl:bg-[url(/images/background/bg-4.jpg)] w-1/2  bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
        </div>
        <div className="h-screen flex justify-center items-center mx-6 xl:w-1/2">
        <Link href="/">
        <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
        </Link>
          <div>
          <div className="text-center">
            <p className="text-3xl font-semibold mb-4">Login</p>
            <p className="text-md text-gray-500 mb-8">To stay connected with us, login with your personal info</p>
          
          <div className="flex flex-col items-center justify-center my-4">
          <div className="w-full text-left text-sm font-semibold mb-2">Matric Number</div>
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
              placeholder="********"
              className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground"
            />
            <span  className="text-right w-full text-sm mt-1 text-foreground">
            <Link href="/authentication/recorver-account">Forgot Password?</Link>
            </span>
           
          </div>
            <button className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105">
           Continue as a user
            </button>
            <button className="text-foreground border-foreground border-rounded  border-2 text-lg my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105">
             Continue as a driver
            </button>
            
            <div className="my-4">
                <Link href="signup">
              <p className="text-gray-600 text-sm">
                Don&apos;t have an account?{" "} <span className="font-bold text-sm text-black hover:text-foreground">Sign Up</span>
              </p>
                </Link>
            </div>

          </div>
          </div>
        </div>

      </div>
      </div>
    );
}
