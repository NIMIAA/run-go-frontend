"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "@/app/components/ui/Notification";
import { driverAuthAPI, ApiError, getErrorMessage } from "@/app/utils/api";
import { setDriverAuthToken, setDriverData } from "@/app/utils/driverAuth";

export default function DriverLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await driverAuthAPI.loginDriver(formData);

      // Store the JWT token for driver
      setDriverAuthToken(response.data!.jwtToken);
      // Store the driver profile data (normalize fields)
      const apiDriver = response.data!.driver;
      setDriverData({
        identifier: apiDriver.identifier,
        carIdentifier: apiDriver.carIdentifier,
        firstName: apiDriver.firstName,
        lastName: apiDriver.lastName,
        email: apiDriver.email,
        phoneNumber: apiDriver.phoneNumber,
        isVerified: apiDriver.isVerified,
        isAvailable: apiDriver.isAvailable,
        completedRides: apiDriver.completedRides,
        averageRating: apiDriver.averageRating,
        dateAdded: new Date(),
        lastUpdatedAt: new Date(),
        currentLatitude: null,
        currentLongitude: null,
      });

      setNotification({
        type: 'success',
        message: response.message || 'Login successful! Redirecting to dashboard...',
        isVisible: true
      });

      // Redirect to driver dashboard (comprehensive)
      setTimeout(() => {
        router.push('/driver_dashboard/dashboard');
      }, 1500);

    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
      <div className="xl:hidden relative h-96 bg-[url(/images/driver-sign-up.jpg)] bg-cover bg-center bg-no-repeat">
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
              Welcome Back, Driver!
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-blue-100">
              Sign in to your RUNGO driver account
            </p>
            <div className="space-y-3 text-left max-w-sm mx-auto mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
                <span className="text-blue-100 text-sm">Track your earnings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🚗</span>
                </div>
                <span className="text-blue-100 text-sm">Manage your rides</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                <span className="text-blue-100 text-sm">View your statistics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Left Side - Background Image with Gradient Overlay */}
      <div className="hidden xl:block fixed left-0 top-0 h-screen w-1/2 z-0">
        <div className="absolute inset-0 bg-[url(/images/driver-sign-up.jpg)] bg-cover bg-center bg-no-repeat"></div>
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
              Welcome Back, Driver!
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Sign in to your RUNGO driver account
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💰</span>
                </div>
                <span className="text-blue-100">Track your earnings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🚗</span>
                </div>
                <span className="text-blue-100">Manage your rides</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <span className="text-blue-100">View your statistics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="xl:ml-[50vw] min-h-screen max-w-full overflow-y-auto overflow-x-hidden relative z-10 bg-white">
        <div className="flex justify-center items-start xl:pt-8 pt-4 pb-8 px-4 sm:px-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <p className="text-2xl sm:text-3xl font-semibold mb-4">Driver Login</p>
              <p className="text-sm text-gray-500 mb-6">
                Sign in to access your driver dashboard
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="group">
                  <div className="text-left text-sm font-semibold mb-2 text-gray-700">Email *</div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.email
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                      }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                      <span>⚠️</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="group">
                  <div className="text-left text-sm font-semibold mb-2 text-gray-700">Password *</div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-12 ${errors.password
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                      <span>⚠️</span> {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/authentication/recorver-account"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#191970] hover:bg-[#15154d] text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#191970]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                  </div>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <Link
                  href="/authentication/drivers-signup"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Create a driver account
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