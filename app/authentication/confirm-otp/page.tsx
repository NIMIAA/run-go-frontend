"use client";
import Link from "next/link";
import { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import { verifyOtp, forgotPassword } from "@/app/utils/api";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function ConfirmOtp() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get email from localStorage
    const resetEmail = localStorage.getItem("resetEmail");
    console.log("Retrieved email from localStorage:", resetEmail);
    if (resetEmail) {
      setEmail(resetEmail);
    } else {
      console.error("No email found in localStorage");
      setError("No email found. Please start the password reset process again.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP form submitted with:", { email, otp });
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("Calling verifyOtp API...");
      const result = await verifyOtp({ email, otp });
      console.log("OTP verification response:", result);
      console.log("OTP verified successfully");
      router.push("/authentication/set-new-password");
    } catch (err: any) {
      console.error("Error in verifyOtp:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      console.log("OTP resent successfully");
      setError(""); // Clear any previous errors
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
                inputStyle={{
                  width: '3.5rem',
                  height: '3.5rem',
                  fontSize: '1.25rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #ccc',
                  textAlign: 'center',
                  margin: '0 0.05rem',
                }}

              />
            </div>

            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Continue"}
              </button>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </form>
            <div className="my-4">
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-gray-600 hover:text-foreground disabled:opacity-50"
              >
                Didn&apos;t receive the email?{" "}
                <span className="font-bold text-sm text-black hover:text-foreground">
                  Click to resend
                </span>
              </button>
            </div>
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

