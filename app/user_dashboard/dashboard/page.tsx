"use client";
import { ChevronRightIcon, ChevronDownIcon, UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserData, User, logout } from "@/app/utils/auth";
import { getWalletBalance, fundWallet } from "@/app/utils/api";
import ProfileAvatar from "@/app/components/profile/ProfileAvatar";
import { useRouter, useSearchParams } from "next/navigation";
import WalletPage from "./wallet/page";
import { useProfileImage } from "@/app/hooks/useProfileImage";

interface Ride {
    id: string;
    driverName: string;
    driverPhone: string;
    carDetails: string;
    pickup: string;
    destination: string;
    status: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { profileImageUrl, isLoading: profileImageLoading } = useProfileImage();
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [walletLoading, setWalletLoading] = useState(false);
    const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
    const [ridesLoading, setRidesLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab");
    const payment = searchParams.get("payment");
    // Payment success message state
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [showAddFundsModal, setShowAddFundsModal] = useState(false);
    const [addFundsAmount, setAddFundsAmount] = useState(0);
    const [addFundsLoading, setAddFundsLoading] = useState(false);
    const [addFundsError, setAddFundsError] = useState("");

    useEffect(() => {
        const userData = getUserData();
        setUser(userData);

        // Load wallet balance
        if (userData?.email) {
            fetchWalletBalance(userData.email);
        }
        // Load upcoming rides
        fetchUpcomingRides();
        setIsLoading(false);
        if (payment === "success") {
            setShowPaymentSuccess(true);
            // Optionally, auto-hide after a few seconds
            setTimeout(() => setShowPaymentSuccess(false), 5000);
        }
    }, [payment]);

    // Auto-refresh upcoming rides every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUpcomingRides();
        }, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchWalletBalance = async (email: string) => {
        try {
            setWalletLoading(true);
            const res = await getWalletBalance(email);
            setWalletBalance(res.data?.balance || 0);
            setWalletLoading(false);
        } catch (err) {
            setWalletBalance(0);
            setWalletLoading(false);
        }
    };

    const fetchUpcomingRides = async () => {
        setRidesLoading(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
            if (!token) {
                console.log("No JWT token found");
                setRidesLoading(false);
                return;
            }

            // Decode JWT to get userIdentifier
            let userIdentifier = "";
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                userIdentifier = payload.userIdentifier || payload.sub || "";
            } catch (error) {
                console.error("Error decoding JWT token:", error);
                setRidesLoading(false);
                return;
            }

            if (!userIdentifier) {
                console.log("No user identifier found in token");
                setRidesLoading(false);
                return;
            }

            const res = await fetch(`/v1/booking/user-upcoming-rides/${userIdentifier}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                console.error("Failed to fetch upcoming rides:", res.status, res.statusText);
                setRidesLoading(false);
                return;
            }

            const data = await res.json();
            const safeArray: Ride[] = Array.isArray(data) ? data : [];
            setUpcomingRides(safeArray);
            console.log("Fetched upcoming rides:", safeArray);
        } catch (err) {
            console.error("Error fetching upcoming rides:", err);
            setUpcomingRides([]);
        } finally {
            setRidesLoading(false);
        }
    };

    const getUserDisplayName = () => {
        if (!user) return "User";
        return `${user.firstName} ${user.lastName}`;
    };

    // Helper to prevent non-numeric and negative/zero input
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setAddFundsAmount(Number(value));
    };

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddFundsError("");
        if (addFundsAmount < 1) {
            setAddFundsError("Amount must be greater than 0");
            return;
        }
        setAddFundsLoading(true);
        try {
            if (!user?.email) throw new Error("User email not found");
            const res = await fundWallet(addFundsAmount, user.email);
            const paystackUrl = res.data?.authorization_url || res.data?.paystackUrl;
            if (paystackUrl) {
                window.location.href = paystackUrl;
            } else {
                setAddFundsError("No payment URL returned");
            }
        } catch (err) {
            setAddFundsError("Failed to initiate funding");
        } finally {
            setAddFundsLoading(false);
        }
    };

    // Tab switching logic
    if (tab === "wallet") {
        return (
            <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8">
                {showPaymentSuccess && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center justify-center">
                        Payment successful! Your wallet has been updated.
                    </div>
                )}
                <WalletPage />
            </div>
        );
    }

    return (
        <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8">
            {/* Top Bar - Mobile: Profile at hamburger level */}
            <div className="lg:hidden flex justify-between items-center mt-4 mb-6">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome, {getUserDisplayName()}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Here&apos;s what&apos;s happening with your account today!
                    </p>
                </div>
                <div className="flex items-center">
                    <img
                        src={profileImageUrl || "/default-profile.png"}
                        alt="Profile"
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                        crossOrigin="anonymous"
                        onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = `<div class='w-10 h-10 bg-gradient-to-br from-[#191970] via-blue-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-base'>${user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : 'U'}</div>`;
                            }
                        }}
                    />
                </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex flex-row justify-between items-center mt-8">
                <div className="flex flex-col justify-center items-start">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome, {getUserDisplayName()}
                    </h1>
                    <p className="text-base text-gray-500 mt-2">
                        Here&apos;s what&apos;s happening with your account today!
                    </p>
                </div>

                {/* Desktop Profile Section */}
                <div className="relative group">
                    <div className="flex flex-row items-center justify-between gap-3 bg-white rounded-lg shadow-md p-3 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex flex-row items-center gap-3">
                            {/* Profile Picture */}
                            <img
                                src={profileImageUrl || "/default-profile.png"}
                                alt="Profile"
                                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                                crossOrigin="anonymous"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = `<div class='w-10 h-10 bg-gradient-to-br from-[#191970] via-blue-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-base'>${user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : 'U'}</div>`;
                                    }
                                }}
                            />
                            {/* User Info */}
                            <div className="flex flex-col items-start justify-center min-w-0">
                                <p className="font-semibold text-gray-800 text-base truncate">
                                    {isLoading ? "Loading..." : getUserDisplayName()}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {isLoading ? "loading@email.com" : user?.email}
                                </p>
                                {user?.isStudent && (
                                    <p className="text-xs text-blue-600 font-medium truncate">
                                        Student • {user.matricNumber}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Dropdown Arrow */}
                        <div className="flex items-center gap-2">
                            <ChevronDownIcon className="size-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Profile Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="py-2">
                            <Link href="/user_dashboard/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <UserCircleIcon className="size-4" />
                                Profile Settings
                            </Link>
                            <Link href="/user_dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <Cog6ToothIcon className="size-4" />
                                Account Settings
                            </Link>
                            <hr className="my-1" />
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid - Reordered for better mobile experience */}
            <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                {/* 1. Wallet Balance - First Priority */}
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border-2 border-gray-100">
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Wallet Balance</h2>
                        <p className="text-xl sm:text-2xl font-bold text-green-600 my-2">
                            {walletLoading ? "Loading..." : `₦ ${walletBalance?.toFixed(2)}`}
                        </p>
                        <button
                            className="flex items-center bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition mt-2 text-sm sm:text-base"
                            onClick={() => setShowAddFundsModal(true)}
                        >
                            Add Funds
                            <ChevronRightIcon className="size-4 ml-1" />
                        </button>
                    </div>
                </div>

                {/* 2. Book Ride Section - Second Priority */}
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                    <div className="relative bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat w-full rounded-lg border h-48 sm:h-64 md:h-80 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#191970]/40 via-[#191970]/30 to-[#DAA520]/30 rounded-lg"></div>
                        <Link href="/user_dashboard/dashboard/rides" className="relative z-10">
                            <button className="bg-gradient-to-br from-[#191970]/95 from-0% via-[#191970]/90 via-80% to-[#191970]/85 to-100% text-white px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-8 rounded-xl hover:from-[#191970]/100 hover:via-[#191970]/95 hover:to-[#191970]/90 transition-all duration-300 text-lg sm:text-xl md:text-2xl font-bold transform hover:scale-105">
                                Book a Ride
                            </button>
                        </Link>
                    </div>
                </div>

                {/* 3. Other Stats Cards - Third Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Upcoming Rides Card */}
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Upcoming Rides</h2>
                        <p className="text-sm sm:text-base text-gray-600">No upcoming rides scheduled.</p>
                    </div>

                    {/* Ride History Card */}
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Ride History</h2>
                        <p className="text-sm sm:text-base text-gray-600">No history.</p>
                    </div>
                </div>
            </div>

            {/* Add Funds Modal */}
            {showAddFundsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Add Funds</h3>
                        <form onSubmit={handleAddFunds}>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="border p-3 rounded w-full mb-4 text-base"
                                placeholder="Enter amount (NGN)"
                                value={addFundsAmount === 0 ? '' : addFundsAmount}
                                onChange={handleAmountChange}
                                required
                            />
                            {addFundsError && <p className="text-red-500 mb-4 text-sm">{addFundsError}</p>}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    type="submit"
                                    className="bg-blue-700 text-white px-4 py-3 rounded hover:bg-blue-600 text-sm sm:text-base flex-1"
                                    disabled={addFundsLoading}
                                >
                                    {addFundsLoading ? "Processing..." : "Proceed to Paystack"}
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-3 rounded hover:bg-gray-400 text-sm sm:text-base flex-1"
                                    onClick={() => setShowAddFundsModal(false)}
                                    disabled={addFundsLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}