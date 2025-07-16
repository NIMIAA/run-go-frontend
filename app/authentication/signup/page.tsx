"use client";
import Link from "next/link";
import { useState } from "react";
import { initiateRegistration, RegisterData } from "@/app/utils/api";
import { ArrowLeftCircleIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  matricNumber?: string;
  general?: string;
}

export default function SignupPage() {
  const [isStudent, setIsStudent] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

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

    let color = "bg-gray-200";
    if (score >= 4) color = "bg-green-500";
    else if (score >= 3) color = "bg-yellow-500";
    else if (score >= 2) color = "bg-orange-500";
    else if (score >= 1) color = "bg-red-500";

    return { score, feedback, color };
  };

  const passwordStrength = calculatePasswordStrength(password);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";

    // Additional validation for common invalid patterns
    if (email.includes("..") || email.includes("@@")) {
      return "Please enter a valid email address";
    }

    const [localPart, domain] = email.split("@");
    if (!localPart || !domain || localPart.length < 1 || domain.length < 3) {
      return "Please enter a valid email address";
    }

    return undefined;
  };

  const validatePhoneNumber = (phone: string): string | undefined => {
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!phone) return "Phone number is required";
    if (!phoneRegex.test(phone)) return "Please enter a valid Nigerian phone number";
    return undefined;
  };

  const validateMatricNumber = (matric: string): string | undefined => {
    if (!isStudent) return undefined;
    if (!matric.trim()) return "Matric number is required for students";
    if (!/^RUN\/[A-Z]{3}\/\d{2}\/\d{5}$/.test(matric)) {
      return "Please enter a valid matric number (e.g., RUN/XYZ/00/00000)";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";

    // Email validation
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    // Phone validation
    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;

    // Matric number validation
    const matricError = validateMatricNumber(matricNumber);
    if (matricError) newErrors.matricNumber = matricError;

    // Password validation
    if (password && passwordStrength.score < 3) {
      newErrors.password = "Password is too weak. Please meet the requirements above.";
    }

    // Confirm password validation
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Initiate registration (store data temporarily + send verification email)
      const registerData: RegisterData = {
        isStudent,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
        ...(isStudent && { matricNumber: matricNumber.trim() }),
      };

      const response = await initiateRegistration(registerData);

      if (response.success) {
        // Store email for verification page
        localStorage.setItem("verificationEmail", email.trim());

        // Redirect immediately to verification page
        window.location.href = `/authentication/verify-email?email=${encodeURIComponent(email.trim())}&mode=registration`;
        return; // Exit early to prevent setLoading(false) from being called
      } else {
        // Handle registration initiation errors
        if (response.message?.includes("email") || response.message?.includes("Email")) {
          setErrors({ email: response.message });
        } else if (response.message?.includes("matric") || response.message?.includes("Matric")) {
          setErrors({ matricNumber: response.message });
        } else if (response.message?.includes("phone") || response.message?.includes("Phone")) {
          setErrors({ phoneNumber: response.message });
        } else {
          setErrors({ general: response.message || "Registration initiation failed" });
        }
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage = err.message;

      // Handle specific backend errors
      if (errorMessage.includes("email") || errorMessage.includes("Email")) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.includes("matric") || errorMessage.includes("Matric")) {
        setErrors({ matricNumber: errorMessage });
      } else if (errorMessage.includes("phone") || errorMessage.includes("Phone")) {
        setErrors({ phoneNumber: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Mobile/Tablet Header - Left Side Content */}
      <div className="xl:hidden relative h-96 bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat">
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
              Join RUNGO Today!
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-blue-100">
              Create your account and start your journey with us
            </p>
            <div className="space-y-3 text-left max-w-sm mx-auto mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🚗</span>
                </div>
                <span className="text-blue-100 text-sm">Book rides easily</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
                <span className="text-blue-100 text-sm">Affordable prices</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🛡️</span>
                </div>
                <span className="text-blue-100 text-sm">Safe and secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Left Side - Background Image with Gradient Overlay */}
      <div className="hidden xl:block fixed left-0 top-0 h-screen w-1/2 z-0">
        <div className="absolute inset-0 bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat"></div>
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
              Join RUNGO Today!
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Create your account and start your journey with us
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🚗</span>
                </div>
                <span className="text-blue-100">Book rides easily</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💰</span>
                </div>
                <span className="text-blue-100">Affordable prices</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🛡️</span>
                </div>
                <span className="text-blue-100">Safe and secure</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join RUNGO and start your journey</p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{errors.general}</span>
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

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="+2348012345678"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Matric Number Field (for students) */}
              {isStudent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matric Number
                  </label>
                  <input
                    type="text"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.matricNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="RUN/XYZ/00/00000"
                  />
                  {errors.matricNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.matricNumber}</p>
                  )}
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
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Create a strong password"
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 w-8 rounded ${level <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {passwordStrength.score < 3 ? 'Weak' : passwordStrength.score < 4 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-gray-600 space-y-1">
                        {passwordStrength.feedback.map((feedback, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <span className="text-red-500">•</span>
                            {feedback}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Confirm your password"
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
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/authentication/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign In
                </Link>
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center text-xs text-gray-500 space-y-1">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
