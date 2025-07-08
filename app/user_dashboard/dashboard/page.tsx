"use client";
import { ChevronRightIcon, ChevronDownIcon, UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserData, User, logout } from "@/app/utils/auth";
import { getUserProfile, getWalletBalance, fundWallet } from "@/app/utils/api";
import ProfileAvatar from "@/app/components/profile/ProfileAvatar";
import { useRouter, useSearchParams } from "next/navigation";
import WalletPage from "./wallet/page";

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [walletLoading, setWalletLoading] = useState(false);
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

        // Load profile data from backend
        loadProfileData();
        // Load wallet balance
        if (userData?.email) {
            fetchWalletBalance(userData.email);
        }
        setIsLoading(false);
        if (payment === "success") {
            setShowPaymentSuccess(true);
            // Optionally, auto-hide after a few seconds
            setTimeout(() => setShowPaymentSuccess(false), 5000);
        }
    }, [payment]);

    const loadProfileData = async () => {
        try {
            const response = await getUserProfile();
            if (response.success && response.data?.profileImageUrl) {
                setProfileImageUrl(`http://localhost:5000${response.data.profileImageUrl}`);
            }
        } catch (error) {
            console.error('Failed to load profile data:', error);
        }
    };

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
            <div className="mx-8">
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
        <div className="mx-8">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col justify-center items-start mt-8">
                    <p className="text-4xl font-bold">Welcome, {getUserDisplayName()}</p>
                    <p className="text-gray-500 mt-2">Here&apos;s what&apos;s happening with your account today!</p>
                </div>

                {/* Profile Section */}
                <div className="mt-8 relative group">
                    <div className="flex flex-row items-center justify-between gap-3 bg-white rounded-lg shadow-md p-3 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex flex-row items-center gap-3">
                            {/* Profile Picture */}
                            <ProfileAvatar
                                user={user}
                                profileImageUrl={profileImageUrl}
                                size="md"
                            />

                            {/* User Info */}
                            <div className="flex flex-col items-start justify-center">
                                <p className="font-semibold text-gray-800">
                                    {isLoading ? "Loading..." : getUserDisplayName()}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {isLoading ? "loading@email.com" : user?.email}
                                </p>
                                {user?.isStudent && (
                                    <p className="text-xs text-blue-600 font-medium">
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
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="col-span-2 grid grid-rows-5 gap-4 mt-8">
                    <div className="row-span-1 flex flex-row gap-4">
                        <div className="bg-white shadow-md rounded-lg p-4 w-1/2">
                            <h2 className="text-xl font-bold">Upcoming Rides</h2>
                            <p>No upcoming rides scheduled.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4 w-1/2">
                            <h2 className="text-xl font-bold">Ride History</h2>
                            <p>No history.</p>
                        </div>
                    </div>
                    <div className="row-span-4 flex flex-row gap-4">
                        <div className="bg-white shadow-md rounded-lg p-4 w-full flex flex-col items-center justify-center">
                            <div className="my-2 relative bg-[url(/images/users-sign-up.jpg)] bg-cover bg-center bg-no-repeat w-full rounded-lg border h-full flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#191970]/40 via-[#191970]/30 to-[#DAA520]/30 rounded-lg"></div>
                                <Link href="/user_dashboard/dashboard/rides" className="relative z-10">
                                    <button className="bg-gradient-to-br from-[#191970]/95 from-0% via-[#191970]/90 via-80% to-[#191970]/85 to-100% text-white px-16 py-8 rounded-xl hover:from-[#191970]/100 hover:via-[#191970]/95 hover:to-[#191970]/90 transition-all duration-300 text-xl font-bold transform hover:scale-105">
                                        Book a Ride
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-1 gap-4 mt-8 grid grid-rows-2">
                    <div className="row-span-1 flex flex-row gap-4">
                        <div className=" bg-white shadow-md rounded-lg p-4 w-full border-2">
                            <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center h-full">
                                <h2 className="text-xl font-bold">Wallet Balance</h2>
                                <p className="text-2xl my-2">{walletLoading ? "Loading..." : `₦ ${walletBalance?.toFixed(2)}`}</p>
                                <div>
                                    <button
                                        className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition mt-2"
                                        onClick={() => setShowAddFundsModal(true)}
                                    >
                                        Add Funds
                                        <ChevronRightIcon className="size-4 ml-1" />
                                    </button>
                                    {showAddFundsModal && (
                                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                                                <h3 className="text-lg font-bold mb-2">Add Funds</h3>
                                                <form onSubmit={handleAddFunds}>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        className="border p-2 rounded w-full mb-4"
                                                        placeholder="Enter amount (NGN)"
                                                        value={addFundsAmount === 0 ? '' : addFundsAmount}
                                                        onChange={handleAmountChange}
                                                        required
                                                    />
                                                    {addFundsError && <p className="text-red-500 mb-2">{addFundsError}</p>}
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="submit"
                                                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                            disabled={addFundsLoading}
                                                        >
                                                            {addFundsLoading ? "Processing..." : "Proceed to Paystack"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
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
                            </div>
                        </div>

                    </div>

                </div>

            </div>


        </div>
    );
}