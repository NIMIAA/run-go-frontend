"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { resetPassword } from "@/app/utils/api";
import { ArrowLeftCircleIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface PasswordStrength {
  score: number;
  feedback: string[];
}

export default function SetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get email from localStorage
    const resetEmail = localStorage.getItem("resetEmail");
    if (resetEmail) {
      setEmail(resetEmail);
    } else {
      setError("No email found. Please start the password reset process again.");
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

    return { score, feedback };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
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
      localStorage.removeItem("resetEmail");
      setTimeout(() => {
        router.push("/authentication/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="xl:flex">
      <div className=" w-1/2 ">
        <div className="xl:bg-black/30 w-1/2 xl:bg-[url(/images/background/passwordreset.jpg)] bg-cover bg-center bg-no-repeat bg-opacity-25 absolute inset-0"></div>
      </div>

      <div className="h-screen flex justify-center items-center  mx-6 xl:w-1/2">
        <Link href="/">
          <ArrowLeftCircleIcon className="absolute text-gray-400 top-4 left-4 size-6 xl:text-white/50 cursor-pointer" />
        </Link>
        <div className="md:w-3/5 w-full">
          <div className="text-center">
            <p className="text-3xl font-semibold mb-4">Set new password</p>
            <p className="text-md text-gray-500 mb-8">Create a strong new password</p>

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

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center justify-center my-4">
                <div className="w-full text-left text-sm font-semibold mb-2">New Password</div>
                <div className="relative w-full">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground pr-12"
                    required
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

              <div className="flex flex-col items-center justify-center my-4">
                <div className="w-full text-left text-sm font-semibold mb-2">Confirm Password</div>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground pr-12"
                    required
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

              <button
                type="submit"
                className="bg-foreground hover:bg-indigo-900 text-background text-md my-2 p-4 rounded w-full cursor-pointer transition-transform duration-200 ease-in hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || newPassword !== confirmPassword || passwordStrength.score < 3}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
            {/* <div className="my-4">
                <Link href="login">
              <p className="font-bold text-sm text-black hover:text-foreground">
                Back to log in{" "} 
              </p>
                </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
