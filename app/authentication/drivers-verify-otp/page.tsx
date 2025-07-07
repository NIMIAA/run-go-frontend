"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "@/app/components/ui/Notification";
import { driverAuthAPI, ApiError, getErrorMessage, setAuthToken } from "@/app/utils/api";


export default function DriverVerifyOTPPage() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
        isVisible: boolean;
    }>({
        type: 'success',
        message: '',
        isVisible: false
    });

    const router = useRouter();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Start resend timer
        setResendTimer(30);
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple characters

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setNotification({
                type: 'error',
                message: 'Please enter the complete 6-digit OTP',
                isVisible: true
            });
            return;
        }

        setIsLoading(true);

        try {
            // Get email from session storage
            const email = sessionStorage.getItem('driverRegistrationEmail');

            if (!email) {
                throw new Error('Email not found. Please try registering again.');
            }

            const response = await driverAuthAPI.verifyOTP({
                email,
                otp: otpString
            });

            setNotification({
                type: 'success',
                message: response.message || 'Email verified successfully! You can now login to your account.',
                isVisible: true
            });

            // Clear session storage
            sessionStorage.removeItem('driverRegistrationEmail');

            // Redirect to driver login page
            setTimeout(() => {
                router.push('/authentication/drivers-login');
            }, 1500);

        } catch (error) {
            let errorMessage = 'Verification failed. Please try again.';

            if (error instanceof ApiError) {
                errorMessage = getErrorMessage(error);
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setNotification({
                type: 'error',
                message: errorMessage,
                isVisible: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        try {
            // Get email from session storage
            const email = sessionStorage.getItem('driverRegistrationEmail');

            if (!email) {
                throw new Error('Email not found. Please try registering again.');
            }

            const response = await driverAuthAPI.resendVerification(email);

            setNotification({
                type: 'success',
                message: response.message || 'OTP resent successfully!',
                isVisible: true
            });

            // Reset timer
            setResendTimer(30);
            const timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error) {
            let errorMessage = 'Failed to resend OTP. Please try again.';

            if (error instanceof ApiError) {
                errorMessage = getErrorMessage(error);
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setNotification({
                type: 'error',
                message: errorMessage,
                isVisible: true
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#191970] via-[#191970]/90 to-[#DAA520]">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                            <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                        <p className="text-gray-600">
                            We've sent a 6-digit verification code to your email address
                        </p>


                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                Enter the 6-digit code
                            </label>
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                                        placeholder="0"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || otp.join('').length !== 6}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Verifying...
                                </div>
                            ) : (
                                "Verify Email"
                            )}
                        </button>
                    </form>

                    {/* Resend OTP */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResendOTP}
                            disabled={resendTimer > 0}
                            className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendTimer > 0
                                ? `Resend in ${resendTimer}s`
                                : "Resend OTP"
                            }
                        </button>


                    </div>

                    {/* Back to Signup */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/authentication/drivers-signup"
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to signup
                        </Link>
                    </div>

                    {/* Back to Driver Login */}
                    <div className="mt-4 text-center">
                        <Link
                            href="/authentication/drivers-login"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Back to driver login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Notification */}
            <Notification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            />


        </div>
    );
} 