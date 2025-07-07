"use client";
import { useState } from "react";
import { ArrowLeftCircleIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "@/app/components/ui/Notification";
import { driverAuthAPI, ApiError, getErrorMessage } from "@/app/utils/api";

export default function RecoverAccountPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'new-password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await driverAuthAPI.forgotPassword(email);

      setNotification({
        type: 'success',
        message: response.message || 'Password reset email sent successfully!',
        isVisible: true
      });

      // Store email in session storage
      sessionStorage.setItem('passwordResetEmail', email);

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

      setStep('otp');

    } catch (error) {
      let errorMessage = 'Failed to send reset email. Please try again.';

      if (error instanceof ApiError) {
        errorMessage = getErrorMessage(error);
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

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await driverAuthAPI.verifyPasswordResetOTP({
        email,
        otp: otpString
      });

      setNotification({
        type: 'success',
        message: response.message || 'OTP verified successfully!',
        isVisible: true
      });

      setStep('new-password');

    } catch (error) {
      let errorMessage = 'Invalid OTP. Please try again.';

      if (error instanceof ApiError) {
        errorMessage = getErrorMessage(error);
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await driverAuthAPI.resetPassword({
        email,
        newPassword,
        confirmPassword
      });

      setNotification({
        type: 'success',
        message: response.message || 'Password reset successfully! Redirecting to login...',
        isVisible: true
      });

      // Clear session storage
      sessionStorage.removeItem('passwordResetEmail');

      // Redirect to login page
      setTimeout(() => {
        router.push('/authentication/drivers-login');
      }, 2000);

    } catch (error) {
      let errorMessage = 'Failed to reset password. Please try again.';

      if (error instanceof ApiError) {
        errorMessage = getErrorMessage(error);
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
      const response = await driverAuthAPI.forgotPassword(email);

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
      }

      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Mobile/Tablet Header - Left Side Content */}
      <div className="xl:hidden relative h-96 bg-[url(/images/passwordreset.jpg)] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-br from-[#191970]/90 via-[#191970]/80 to-[#DAA520]/70"></div>
        {/* Back to Home Arrow - Mobile */}
        <Link href="/" className="absolute top-4 left-4 z-20 text-white/80 hover:text-white transition-colors duration-200">
          <ArrowLeftCircleIcon className="w-8 h-8" />
        </Link>
        {/* Mobile Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4">
              <img src="/images/Logo.png" alt="RUNGO Logo" className="w-24 h-auto object-contain drop-shadow-lg" onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentNode;
                if (parent) {
                  (parent as HTMLElement).insertAdjacentHTML(
                    'beforeend',
                    "<span style='color:white;font-size:1.5rem;font-weight:bold;'>RUNGO</span>"
                  );
                }
              }} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Reset Your Password
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-blue-100">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'otp' && 'Enter the verification code sent to your email'}
              {step === 'new-password' && 'Create a new password for your account'}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Left Side - Background Image with Gradient Overlay */}
      <div className="hidden xl:block fixed left-0 top-0 h-screen w-1/2 z-0">
        <div className="absolute inset-0 bg-[url(/images/passwordreset.jpg)] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#191970]/90 via-[#191970]/80 to-[#DAA520]/70"></div>
        {/* Back to Home Arrow - Desktop */}
        <Link href="/" className="absolute top-6 left-6 z-20 text-white/80 hover:text-white transition-colors duration-200">
          <ArrowLeftCircleIcon className="w-10 h-10" />
        </Link>
        {/* Desktop Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <img src="/images/Logo.png" alt="RUNGO Logo" className="w-36 h-auto object-contain drop-shadow-lg" onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentNode;
                if (parent) {
                  (parent as HTMLElement).insertAdjacentHTML(
                    'beforeend',
                    "<span style='color:white;font-size:2rem;font-weight:bold;'>RUNGO</span>"
                  );
                }
              }} />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Reset Your Password
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'otp' && 'Enter the verification code sent to your email'}
              {step === 'new-password' && 'Create a new password for your account'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="xl:ml-[50vw] min-h-screen max-w-full overflow-y-auto overflow-x-hidden relative z-10 bg-white">
        <div className="flex justify-center items-start xl:pt-8 pt-4 pb-8 px-4 sm:px-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                {step === 'email' && <EnvelopeIcon className="h-6 w-6 text-blue-600" />}
                {step === 'otp' && <EnvelopeIcon className="h-6 w-6 text-blue-600" />}
                {step === 'new-password' && <LockClosedIcon className="h-6 w-6 text-blue-600" />}
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
                {step === 'email' && 'Forgot Password?'}
                {step === 'otp' && 'Verify Your Email'}
                {step === 'new-password' && 'Create New Password'}
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                {step === 'email' && 'Enter your email address and we\'ll send you a reset code'}
                {step === 'otp' && 'We\'ve sent a 6-digit verification code to your email'}
                {step === 'new-password' && 'Enter your new password below'}
              </p>

              {/* Test Button - Only in development */}
              {process.env.NODE_ENV === 'development' && step === 'email' && (
                <button
                  onClick={async () => {
                    const testEmail = "test@example.com";
                    alert('🧪 Testing forgot password endpoint...');

                    try {
                      const response = await fetch('http://localhost:5000/v1/driver/auth/forgot-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: testEmail })
                      });

                      const result = await response.json();
                      alert(`📋 Forgot Password Test Result:\nStatus: ${response.status}\nMessage: ${result.message || 'No message'}`);

                      if (response.ok) {
                        // Test OTP verification
                        const otpResponse = await fetch('http://localhost:5000/v1/drivers/verify-otp', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: testEmail,
                            otp: "123456"
                          })
                        });

                        const otpResult = await otpResponse.json();
                        alert(`🔐 Password Reset OTP Test:\nStatus: ${otpResponse.status}\nMessage: ${otpResult.message || 'No message'}`);

                        // Test password reset
                        if (otpResponse.ok) {
                          const resetResponse = await fetch('http://localhost:5000/v1/driver/auth/reset-password', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              newPassword: "NewPassword123!",
                              confirmPassword: "NewPassword123!"
                            })
                          });

                          const resetResult = await resetResponse.json();
                          alert(`🔄 Password Reset Test:\nStatus: ${resetResponse.status}\nMessage: ${resetResult.message || 'No message'}`);
                        }
                      }
                    } catch (error) {
                      alert(`❌ Password reset test failed: ${error}`);
                    }
                  }}
                  className="mb-4 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded"
                >
                  🧪 Test Password Reset API
                </button>
              )}

              {/* Step Indicator */}
              <div className="flex justify-center items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    1
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step === 'email' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                    Email
                  </span>
                </div>
                <div className={`w-8 h-1 ${step === 'otp' || step === 'new-password' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 'otp' ? 'bg-blue-600 text-white' : step === 'new-password' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    2
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step === 'otp' ? 'text-blue-600' : step === 'new-password' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                    Verify
                  </span>
                </div>
                <div className={`w-8 h-1 ${step === 'new-password' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 'new-password' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    3
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step === 'new-password' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                    Reset
                  </span>
                </div>
              </div>

              {/* Step 1: Email Form */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="group">
                    <div className="text-left text-sm font-semibold mb-2 text-gray-700">Email Address *</div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                        }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                        <span>⚠️</span> {errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#191970] hover:bg-[#15154d] text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#191970]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending Reset Code...
                      </div>
                    ) : (
                      "Send Reset Code"
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: OTP Form */}
              {step === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      Enter the 6-digit code
                    </label>
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                          placeholder="0"
                        />
                      ))}
                    </div>
                    {errors.otp && (
                      <p className="text-red-500 text-xs mt-2 text-center">{errors.otp}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length !== 6}
                    className="w-full bg-[#191970] hover:bg-[#15154d] text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#191970]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify Code"
                    )}
                  </button>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0}
                      className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendTimer > 0
                        ? `Resend in ${resendTimer}s`
                        : "Resend Code"
                      }
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password Form */}
              {step === 'new-password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="group">
                    <div className="text-left text-sm font-semibold mb-2 text-gray-700">New Password *</div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter your new password"
                        className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-12 ${errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                        <span>⚠️</span> {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <div className="text-left text-sm font-semibold mb-2 text-gray-700">Confirm New Password *</div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your new password"
                        className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-12 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                        <span>⚠️</span> {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#191970] hover:bg-[#15154d] text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#191970]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              )}

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/authentication/drivers-login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  ← Back to login
                </Link>
              </div>
            </div>
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
