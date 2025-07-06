"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { forgotPassword, verifyOtp, resetPassword } from "@/app/utils/api";
import { ArrowLeftCircleIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

interface PasswordStrength {
  score: number;
  feedback: string[];
}

export default function RecorverAccount() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Rate limiting states
  const [forgotPasswordCountdown, setForgotPasswordCountdown] = useState(0);
  const [otpResendCountdown, setOtpResendCountdown] = useState(0);
  const [forgotPasswordAttempts, setForgotPasswordAttempts] = useState(0);
  const [otpResendAttempts, setOtpResendAttempts] = useState(0);

  const router = useRouter();
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Countdown timers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (forgotPasswordCountdown > 0) {
      interval = setInterval(() => {
        setForgotPasswordCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [forgotPasswordCountdown]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpResendCountdown > 0) {
      interval = setInterval(() => {
        setOtpResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpResendCountdown]);

  // Auto-focus OTP input
  useEffect(() => {
    if (currentStep === 2 && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [currentStep]);

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include lowercase letter");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include uppercase letter");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include number");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Include special character");
    }

    return { score, feedback };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  // Step 1: Email Verification
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess("OTP sent successfully to your email!");
      setForgotPasswordAttempts(prev => prev + 1);
      if (forgotPasswordAttempts >= 2) {
        setForgotPasswordCountdown(300); // 5 minutes
      }
      setTimeout(() => setCurrentStep(2), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP Verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await verifyOtp({ email, otp });
      setSuccess("OTP verified successfully!");
      setTimeout(() => setCurrentStep(3), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpResendCountdown > 0) return;

    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess("OTP resent successfully!");
      setOtpResendAttempts(prev => prev + 1);
      if (otpResendAttempts >= 4) {
        setOtpResendCountdown(300); // 5 minutes
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Password Reset
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Password is too weak. Please meet the requirements above.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ email, newPassword, confirmPassword });
      setSuccess("Password reset successfully!");
      setTimeout(() => {
        router.push("/authentication/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="xl:flex">
        <div className="w-1/2">
          <div className="xl:bg-black/30 w-1/2 xl:bg-[url(/images/background/passwordreset.jpg)] bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
        </div>

        <div className="h-screen flex justify-center items-center mx-6 xl:w-1/2">
          <Link href="/">
            <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
          </Link>

          <div className="md:w-3/5 w-full">
            <div className="text-center">
              {/* Step Indicators */}
              <div className="flex justify-center items-center mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                      }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}></div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-3xl font-semibold mb-4">
                {currentStep === 1 && "Forgot password?"}
                {currentStep === 2 && "Enter OTP"}
                {currentStep === 3 && "Set new password"}
              </p>

              <p className="text-md text-gray-500 mb-8">
                {currentStep === 1 && "No worries, we'll send you reset instructions"}
                {currentStep === 2 && "We sent a code to your email"}
                {currentStep === 3 && "Create a strong new password"}
              </p>

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

              {/* Step 1: Email Verification */}
              {currentStep === 1 && (
                <form onSubmit={handleEmailSubmit}>
                  <div className="flex flex-col items-center justify-center my-4">
                    <div className="w-full text-left text-sm font-semibold mb-2">Email</div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || forgotPasswordCountdown > 0}
                  >
                    {loading ? "Sending..." : forgotPasswordCountdown > 0 ? `Wait ${formatTime(forgotPasswordCountdown)}` : "Send Reset Link"}
                  </button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {currentStep === 2 && (
                <form onSubmit={handleOtpSubmit}>
                  <div className="flex flex-col items-center justify-center my-4">
                    <div className="w-full text-left text-sm font-semibold mb-2">OTP Code</div>
                    <input
                      ref={otpInputRef}
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading || otpResendCountdown > 0}
                      className="text-sm text-gray-600 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Didn't receive the email?{" "}
                      <span className="font-bold text-black hover:text-foreground">
                        {otpResendCountdown > 0 ? `Resend in ${formatTime(otpResendCountdown)}` : "Click to resend"}
                      </span>
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-sm font-bold text-black hover:text-foreground"
                    >
                      ← Back to email
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Password Reset */}
              {currentStep === 3 && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="flex flex-col items-center justify-center my-4">
                    <div className="w-full text-left text-sm font-semibold mb-2">New Password</div>
                    <div className="relative w-full">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground pr-12"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  <div className="mb-4">
                    <div className="text-left text-sm font-semibold mb-2">Password Strength</div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded ${level <= passwordStrength.score
                              ? passwordStrength.score <= 2
                                ? 'bg-red-500'
                                : passwordStrength.score <= 3
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">
                      {passwordStrength.score <= 2 && "Weak"}
                      {passwordStrength.score === 3 && "Fair"}
                      {passwordStrength.score >= 4 && "Strong"}
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        {passwordStrength.feedback.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center my-4">
                    <div className="w-full text-left text-sm font-semibold mb-2">Confirm Password</div>
                    <div className="relative w-full">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground pr-12"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || newPassword !== confirmPassword || passwordStrength.score < 3}
                  >
                    {loading ? "Resetting Password..." : "Reset Password"}
                  </button>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-sm font-bold text-black hover:text-foreground"
                    >
                      ← Back to OTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
