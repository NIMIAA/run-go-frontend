"use client";
import Link from "next/link";
import { useState } from 'react';
import OtpInput from 'react-otp-input';

import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
export default function ConfirmOtp() {
  const [otp, setOtp] = useState('');

    return (
      <div className="xl:flex">
        <div className=" w-1/2 ">
          <div className="xl:bg-black/30 w-1/2 xl:bg-[url(/images/background/passwordreset.jpg)] bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
        </div>

        <div className="h-screen flex justify-center items-center  mx-6 xl:w-1/2">
        <Link href="/">
        <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
        </Link>
        <div className="lg:w-3/5">
          <div className="text-center">
            <p className="text-3xl font-semibold mb-4">Password reset</p>
            <p className="text-md text-gray-500 mb-8">We sent a code to you</p>
           
            <div className="flex justify-center items-center">
            <OtpInput
            
      value={otp}
      onChange={setOtp}
      numInputs={6}
      renderSeparator={<span>-</span>}
      renderInput={(props) => <input {...props} />}
      containerStyle="mb-4"
      inputStyle={{width: '3.5rem',
        height: '3.5rem',
        fontSize: '1.25rem',
        borderRadius: '0.5rem',
        border: '2px solid #ccc',
        textAlign: 'center',
        margin: '0 0.05rem',
      }}
      
    />
            </div>
            
          <Link href="set-new-password">
          <button className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105">
              Continue
            </button>
          </Link>
            <div className="my-4">
                <Link href="login">
              <p>
                Didn&apos;t receive the email{" "} <span className="font-bold text-sm text-black hover:text-foreground">Click to resend</span>
                  
              </p>
                </Link>
            </div>
            <div className="my-4">
                <Link href="login">
              <p className="font-bold text-sm text-black hover:text-foreground">
                Back to log in{" "} 
              </p>
                </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

