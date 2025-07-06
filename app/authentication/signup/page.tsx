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
    <div className="xl:flex">
      <div className="w-1/2">
        <div className="xl:bg-black/50 bg-blend-multiply w-1/2 xl:bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
      </div>
      <div className="h-screen flex justify-center items-center mx-4 sm:mx-6 xl:w-1/2 overflow-y-auto">
        <Link href="/">
          <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
        </Link>
        <div className="w-full max-w-md py-8">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-semibold mb-4">Hello, Friend</p>
            <p className="text-sm sm:text-md text-gray-500 mb-6">
              Create an account to get your journey with us started
            </p>
            <p className="text-xs text-blue-600 mb-4">
              📧 Use a real email address you can access - verification code will be sent there
            </p>
            <p className="text-xs text-gray-600 mb-4">
              After verification, you'll be redirected to login to complete your account setup
            </p>



            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-center">
                <XCircleIcon className="h-5 w-5 mr-2" />
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Toggle */}
              <div className="flex items-center justify-center">
                <label className="mr-2 font-semibold text-sm">I am a student</label>
                <input
                  type="checkbox"
                  checked={isStudent}
                  onChange={() => setIsStudent(!isStudent)}
                  className="w-4 h-4"
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-left text-sm font-semibold mb-1">First Name *</div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="John"
                    className={`p-3 rounded w-full border-2 focus:outline-foreground text-sm ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 text-left">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <div className="text-left text-sm font-semibold mb-1">Last Name *</div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Doe"
                    className={`p-3 rounded w-full border-2 focus:outline-foreground text-sm ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 text-left">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Matric Number (Conditional) */}
              {isStudent && (
                <div>
                  <div className="text-left text-sm font-semibold mb-1">Matric Number *</div>
                  <input
                    type="text"
                    value={matricNumber}
                    onChange={e => setMatricNumber(e.target.value)}
                    placeholder="RUN/XYZ/00/00000"
                    className={`p-3 rounded w-full border-2 focus:outline-foreground text-sm ${errors.matricNumber ? 'border-red-500' : 'border-gray-300'}`}
                    required={isStudent}
                  />
                  {errors.matricNumber && (
                    <p className="text-red-500 text-xs mt-1 text-left">{errors.matricNumber}</p>
                  )}
                </div>
              )}

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-left text-sm font-semibold mb-1">Email *</div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={`p-3 rounded w-full border-2 focus:outline-foreground text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>
                  )}
                </div>
                <div>
                  <div className="text-left text-sm font-semibold mb-1">Phone *</div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="08012345678"
                    className={`p-3 rounded w-full border-2 focus:outline-foreground text-sm ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1 text-left">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div>
                <div className="text-left text-sm font-semibold mb-1">Password *</div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`p-3 rounded w-full border-2 focus:outline-foreground text-sm pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.password}</p>
                )}

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded ${level <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <ul className="list-disc list-inside">
                          {passwordStrength.feedback.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="text-left text-sm font-semibold mb-1">Confirm Password *</div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={`p-3 rounded w-full border-2 focus:outline-foreground text-sm pr-12 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Initiating Registration..." : "Continue to Verification"}
              </button>
            </form>

            {/* Navigation Links */}
            <div className="my-4 space-y-2">
              <Link href="/authentication/login">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <span className="font-bold text-sm text-black hover:text-foreground">
                    Sign In
                  </span>
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
