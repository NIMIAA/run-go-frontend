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
    <div>
      <div className="xl:flex">
        <div className="w-1/2">
          <div className="xl:bg-black/50 bg-blend-multiply xl:bg-[url(/images/background/bg-4.jpg)] w-1/2 bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
        </div>
        <div className="h-screen flex justify-center items-center mx-6 xl:w-1/2">
          <Link href="/">
            <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
          </Link>
          <div>
            <div className="text-center">
              <p className="text-3xl font-semibold mb-4">Login</p>
              <p className="text-md text-gray-500 mb-8">
                To stay connected with us, login with your personal info
              </p>

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-center">
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-center my-4">
                  <label className="mr-2 font-semibold">I am a student</label>
                  <input
                    type="checkbox"
                    checked={isStudent}
                    onChange={() => setIsStudent(!isStudent)}
                  />
                </div>
                {isStudent ? (
                  <div className="flex flex-col items-center justify-center my-4">
                    <div className="w-full text-left text-sm font-semibold mb-2">
                      Matric Number
                    </div>
                    <input
                      type="text"
                      value={matricNumber}
                      onChange={e => setMatricNumber(e.target.value)}
                      placeholder="run/xyz/00/0000"
                      className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground"
                      required
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center my-4">
                    <div className="w-full text-left text-sm font-semibold mb-2">
                      Email
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground"
                      required
                    />
                  </div>
                )}
                <div className="flex flex-col items-center justify-center my-4">
                  <div className="w-full text-left text-sm font-semibold mb-2">
                    Password
                  </div>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="********"
                      className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground pr-12"
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
                  <span className="text-right w-full text-sm mt-1 text-foreground">
                    <Link href="/authentication/recorver-account">
                      Forgot Password?
                    </Link>
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Continue as a user"}
                </button>
              </form>

              {/* Help Links */}
              <div className="my-4 space-y-2">
                <Link href="/authentication/signup">
                  <p className="text-gray-600 text-sm">
                    Don&apos;t have an account?{" "}
                    <span className="font-bold text-sm text-black hover:text-foreground">
                      Sign Up
                    </span>
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
