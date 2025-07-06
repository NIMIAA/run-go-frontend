"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { verifyRegistration, resendRegistrationVerification } from "@/app/utils/api";
import { setAuthToken, setUserData } from "@/app/utils/auth";
import { ArrowLeftCircleIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [resendAttempts, setResendAttempts] = useState(0);
    const [isRegistrationMode, setIsRegistrationMode] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const otpInputRef = useRef<HTMLInputElement>(null);

    // Get email from URL params or localStorage and check mode
    useEffect(() => {
        const emailParam = searchParams.get("email");
        const modeParam = searchParams.get("mode");
        const storedEmail = localStorage.getItem("verificationEmail");

        // Check if this is registration mode
        if (modeParam === "registration") {
            setIsRegistrationMode(true);
        }

        if (emailParam) {
            setEmail(emailParam);
        } else if (storedEmail) {
            setEmail(storedEmail);
        } else {
            setError("No email found. Please start the registration process again.");
        }
    }, [searchParams]);

    // Countdown timer for resend
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Auto-focus OTP input
    useEffect(() => {
        if (otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, []);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !otp) {
            setError("Please enter your email and OTP");
            return;
        }

        if (otp.length !== 6) {
            setError("Please enter a 6-digit verification code");
            return;
        }

        setError("");
        setLoading(true);
        try {
            const response = await verifyRegistration({ email, otp });

            if (response.success) {
                setSuccess("Registration completed successfully! Your account has been created and verified. You will be redirected to the login page to sign in.");
                setIsVerified(true);

                // Clear stored email
                localStorage.removeItem("verificationEmail");

                // Always redirect to login after successful verification
                setTimeout(() => {
                    router.push("/authentication/login");
                }, 2000);
            }
        } catch (err: any) {
            // Handle rate limiting errors specifically
            if (err.message.includes("ThrottlerException") || err.message.includes("Too Many Requests")) {
                setError("Rate limit exceeded. Please try again in 5 minutes, or use the resend button to get a new code.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        // Check rate limiting (3 attempts per 5 minutes)
        if (resendAttempts >= 3) {
            setError("Too many resend attempts. Please wait 5 minutes before trying again.");
            return;
        }

        setError("");
        setResendLoading(true);
        try {
            const response = await resendRegistrationVerification({ email });

            if (response.success) {
                setSuccess("Verification email sent successfully!");
                setResendAttempts(prev => prev + 1);
                setCountdown(60); // 1 minute countdown
            }
        } catch (err: any) {
            // Handle rate limiting errors specifically
            if (err.message.includes("ThrottlerException") || err.message.includes("Too Many Requests")) {
                setError("Rate limit exceeded. Please try again in 5 minutes.");
            } else {
                setError(err.message);
            }
        } finally {
            setResendLoading(false);
        }
    };

    const handleOtpChange = (value: string) => {
        // Only allow numbers and limit to 6 digits
        const numericValue = value.replace(/\D/g, "");
        if (numericValue.length <= 6) {
            setOtp(numericValue);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        // Auto-submit when 6 digits are entered
        if (otp.length === 6 && e.key === "Enter") {
            handleVerify(e as any);
        }
    };

    const canResend = countdown === 0 && resendAttempts < 3;

    return (
        <div className="xl:flex">
            <div className="w-1/2">
                <div className="xl:bg-black/50 bg-blend-multiply w-1/2 xl:bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
            </div>
            <div className="h-screen flex justify-center items-center mx-6 xl:w-1/2">
                <Link href="/authentication/signup">
                    <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
                </Link>
                <div className="w-full max-w-md">
                    <div className="text-center">
                        {isVerified ? (
                            <div className="space-y-4">
                                <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                                <h1 className="text-2xl font-bold text-gray-900">Registration Completed!</h1>
                                <p className="text-gray-600">Your account has been created and verified successfully.</p>
                                <div className="animate-pulse">
                                    <p className="text-sm text-gray-500">
                                        Redirecting to login...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {isRegistrationMode ? "Complete Your Registration" : "Verify Your Email"}
                                    </h1>
                                    <p className="text-gray-600">
                                        We've sent a verification code to <strong>{email}</strong>
                                        {isRegistrationMode && " to complete your account creation"}
                                    </p>
                                </div>

                                {/* Success/Error Messages */}
                                {success && (
                                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center justify-center">
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        {success}
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-center">
                                        <XCircleIcon className="h-5 w-5 mr-2" />
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleVerify} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                                            Verification Code
                                        </label>
                                        <input
                                            ref={otpInputRef}
                                            type="text"
                                            value={otp}
                                            onChange={(e) => handleOtpChange(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Enter 6-digit code"
                                            className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                                            maxLength={6}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1 text-left">
                                            Enter the 6-digit code sent to your email
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !email || otp.length !== 6}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? "Completing Registration..." : (isRegistrationMode ? "Complete Registration" : "Verify Email")}
                                    </button>
                                </form>

                                {/* Resend Section */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Didn't receive the code?
                                    </p>
                                    <button
                                        onClick={handleResend}
                                        disabled={!canResend || resendLoading}
                                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        {resendLoading ? (
                                            <>
                                                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : countdown > 0 ? (
                                            `Resend in ${countdown}s`
                                        ) : resendAttempts >= 3 ? (
                                            "Rate limit exceeded"
                                        ) : (
                                            "Resend Code"
                                        )}
                                    </button>

                                    {resendAttempts > 0 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Resend attempts: {resendAttempts}/3
                                        </p>
                                    )}
                                </div>

                                {/* Navigation Links */}
                                <div className="mt-6 space-y-2">
                                    <Link href="/authentication/signup">
                                        <p className="text-sm text-gray-600">
                                            Back to registration{" "}
                                            <span className="font-semibold text-blue-600 hover:text-blue-700">
                                                Sign up
                                            </span>
                                        </p>
                                    </Link>
                                    <Link href="/authentication/login">
                                        <p className="text-sm text-gray-600">
                                            Already have an account?{" "}
                                            <span className="font-semibold text-blue-600 hover:text-blue-700">
                                                Sign in
                                            </span>
                                        </p>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 