"use client";
import Link from "next/link";
import { useState } from "react";
import { loginUser, LoginData } from "@/app/utils/api";
import { setAuthToken, setUserData } from "@/app/utils/auth";
import { ArrowLeftCircleIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isStudent, setIsStudent] = useState(true);
  const [matricNumber, setMatricNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validation function for matric number
  const validateMatricNumber = (matric: string): string | undefined => {
    if (!isStudent) return undefined;
    if (!matric.trim()) return "Matric number is required for students";
    if (!/^RUN\/[A-Z]{3}\/\d{2}\/\d{5}$/.test(matric)) {
      return "Please enter a valid matric number (e.g., RUN/XYZ/00/00000)";
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate matric number if student
    if (isStudent) {
      const matricError = validateMatricNumber(matricNumber);
      if (matricError) {
        setError(matricError);
        return;
      }
    }

    setLoading(true);

    try {
      const loginData: LoginData = {
        isStudent,
        password,
        ...(isStudent ? { matricNumber: matricNumber.trim() } : { email: email.trim() }),
      };

      const response = await loginUser(loginData);

      if (response.success) {
        setSuccess("Login successful! Redirecting to dashboard...");

        // Store JWT token if provided
        const token = response.data?.jwtToken || response.data?.token;
        if (token) {
          setAuthToken(token);
        } else {
          setError("Login successful but no authentication token received");
          return;
        }

        // Store user data if provided
        if (response.data?.user) {
          setUserData(response.data.user);
        }

        // Redirect to dashboard immediately
        router.push("/user_dashboard/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      const errorMessage = err.message;

      // Handle email verification error specifically
      if (errorMessage.includes("EMAIL_NOT_VERIFIED") || errorMessage.includes("email verification")) {
        setError("Please verify your email address before logging in. Check your email for the verification code. If you just completed verification, please wait a moment and try again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Mobile/Tablet Header - Left Side Content */}
      <div className="xl:hidden relative h-96 bg-[url(/images/background/bg-4.jpg)] bg-cover bg-center bg-no-repeat">
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
              Welcome Back!
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-blue-100">
              Sign in to your RUNGO account
            </p>
            <div className="space-y-3 text-left max-w-sm mx-auto mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🚗</span>
                </div>
                <span className="text-blue-100 text-sm">Book your rides</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
                <span className="text-blue-100 text-sm">Track your spending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                <span className="text-blue-100 text-sm">View your history</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Left Side - Background Image with Gradient Overlay */}
      <div className="hidden xl:block fixed left-0 top-0 h-screen w-1/2 z-0">
        <div className="absolute inset-0 bg-[url(/images/background/bg-4.jpg)] bg-cover bg-center bg-no-repeat"></div>
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
              Welcome Back!
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Sign in to your RUNGO account
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🚗</span>
                </div>
                <span className="text-blue-100">Book your rides</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💰</span>
                </div>
                <span className="text-blue-100">Track your spending</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <span className="text-blue-100">View your history</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="xl:ml-[50%] xl:w-[50%] min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Back Arrow */}
          <div className="xl:hidden mb-6">
            <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <ArrowLeftCircleIcon className="w-8 h-8" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Welcome back to RUNGO</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Toggle */}
              <div className="flex items-center justify-center p-2 bg-gray-100 rounded-lg">
                <label className="mr-4 font-medium text-gray-700">I am a student</label>
                <input
                  type="checkbox"
                  checked={isStudent}
                  onChange={() => setIsStudent(!isStudent)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              {/* Login Field */}
              {isStudent ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matric Number
                  </label>
                  <input
                    type="text"
                    value={matricNumber}
                    onChange={e => setMatricNumber(e.target.value)}
                    placeholder="RUN/XYZ/00/00000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <Link href="/authentication/recorver-account" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/authentication/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
