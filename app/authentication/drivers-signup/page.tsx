"use client";
import { useState, useRef, useEffect } from "react";
import { EyeIcon, EyeSlashIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "@/app/components/ui/Notification";

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

export default function DriverSignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    carIdentifier: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollTop = 0;
    }
  }, []);

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

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone Number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Car Identifier validation
    if (!formData.carIdentifier.trim()) {
      newErrors.carIdentifier = "Car identifier is required";
    } else if (formData.carIdentifier.trim().length < 3) {
      newErrors.carIdentifier = "Car identifier must be at least 3 characters";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Skip validation for now - will be implemented with API
    setIsLoading(true);

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));

      setNotification({
        type: 'success',
        message: 'Registration successful! Please verify your email.',
        isVisible: true
      });

      // Redirect to driver OTP verification page
      setTimeout(() => {
        router.push('/authentication/drivers-verify-otp');
      }, 1500);

    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Registration failed. Please try again.',
        isVisible: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    <div className="xl:flex h-screen w-full">
      {/* Left Side - Background Image with Gradient Overlay */}
      <div className="hidden xl:block fixed left-0 top-0 h-screen w-1/2 z-0">
        <div className="absolute inset-0 bg-[url(/images/driver-sign-up.jpg)] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#191970]/90 via-[#191970]/80 to-[#DAA520]/70"></div>
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            {/* Logo instead of emoji */}
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
            <Link href="/" className="inline-block mb-4 text-lg font-semibold text-[#DAA520] hover:underline hover:text-white transition-colors duration-200 xl:mb-8">
              ← Back to Home
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Join Our RUNGo Driver Network
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Start earning by providing safe and reliable rides
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💰</span>
                </div>
                <span className="text-blue-100">Earn competitive rates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🚗</span>
                </div>
                <span className="text-blue-100">Flexible working hours</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🛡️</span>
                </div>
                <span className="text-blue-100">Safe and secure platform</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-blue-100 mb-2">
                📧 Use a real email address you can access
              </p>
              <p className="text-xs text-blue-200">
                Verification code will be sent there
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div ref={formContainerRef} className="flex-1 xl:ml-[50vw] min-h-screen w-full overflow-y-auto relative z-10 bg-white">
        <div className="flex justify-center items-start pt-8 pb-8 px-4 sm:px-6">
          <Link href="/">
            <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
          </Link>
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <p className="text-2xl sm:text-3xl font-semibold mb-4">Create Driver Account</p>
              <p className="text-sm text-gray-500 mb-6">
                Fill in your details to get started
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group">
                    <div className="text-left text-sm font-semibold mb-2 text-gray-700">First Name *</div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.firstName
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                        }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                        <span>⚠️</span> {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <div className="text-left text-sm font-semibold mb-2 text-gray-700">Last Name *</div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.lastName
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                        }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                        <span>⚠️</span> {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="group">
                    <div className="text-left text-sm font-semibold mb-2 text-gray-700">Phone *</div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="08012345678"
                      className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.phoneNumber
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                        }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                        <span>⚠️</span> {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Car Identifier */}
                <div className="group">
                  <div className="text-left text-sm font-semibold mb-2 text-gray-700">Car Identifier *</div>
                  <input
                    id="carIdentifier"
                    name="carIdentifier"
                    type="text"
                    value={formData.carIdentifier}
                    onChange={handleInputChange}
                    placeholder="ABC123XY"
                    className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.carIdentifier
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                      }`}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-left">
                    Enter your car's license plate number or unique identifier
                  </p>
                  {errors.carIdentifier && (
                    <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                      <span>⚠️</span> {errors.carIdentifier}
                    </p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="group">
                  <div className="text-left text-sm font-semibold mb-2 text-gray-700">Password *</div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">Password Strength</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${passwordStrength.score >= 4 ? 'bg-green-100 text-green-800' :
                          passwordStrength.score >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            passwordStrength.score >= 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {passwordStrength.score >= 4 ? 'Strong' :
                            passwordStrength.score >= 3 ? 'Good' :
                              passwordStrength.score >= 2 ? 'Fair' : 'Weak'}
                        </span>
                      </div>
                      <div className="flex space-x-1 mb-3">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded transition-all duration-300 ${level <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                              }`}
                          />
                        ))}
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <div className="text-xs text-gray-600">
                          <p className="font-medium mb-1">To improve your password:</p>
                          <ul className="space-y-1">
                            {passwordStrength.feedback.map((item, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="group">
                  <div className="text-left text-sm font-semibold mb-2 text-gray-700">Confirm Password *</div>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className={`w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-12 ${errors.confirmPassword
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-blue-500 group-hover:border-gray-400'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                      <span>⚠️</span> {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.agreeToTerms}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#191970] hover:bg-[#15154d] text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#191970]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Driver Account"
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
                    <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                  </div>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <Link
                  href="/authentication/drivers-login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in to your driver account
                </Link>
              </div>

              {/* Back to Main Signup */}
              <div className="mt-4 text-center"></div>
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