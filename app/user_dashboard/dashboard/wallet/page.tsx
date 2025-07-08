"use client";
import { useEffect, useState } from "react";
import { fundWallet, getWalletBalance, getWalletTransactions } from "@/app/utils/api";
import { getUserData } from "@/app/utils/auth";
import { WalletIcon, ArrowDownTrayIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export default function WalletPage() {
    const [balance, setBalance] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [txLoading, setTxLoading] = useState(false);
    const [txError, setTxError] = useState("");
    const [selectedTx, setSelectedTx] = useState<any | null>(null);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const user = getUserData();
    const userEmail = user?.email || "";

    const fetchBalance = async () => {
        try {
            setLoading(true);
            const res = await getWalletBalance(userEmail);
            setBalance(res.data?.balance || 0);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch balance");
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            setTxLoading(true);
            const res = await getWalletTransactions(userEmail);
            setTransactions(res.data || []);
            setTxLoading(false);
        } catch (err) {
            setTxError("Failed to fetch transactions");
            setTxLoading(false);
        }
    };

    useEffect(() => {
        if (!userEmail) return;
        fetchBalance();
        fetchTransactions();
        // Auto-refresh after Paystack redirect
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.has('reference') || window.location.hash.includes('paystack')) {
                fetchBalance();
                fetchTransactions();
            }
        }
    }, [userEmail]);

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fundWallet(amount, userEmail);
            const paystackUrl = res.data?.authorization_url || res.data?.paystackUrl;
            if (paystackUrl) {
                window.location.href = paystackUrl;
            } else {
                setError("No payment URL returned");
            }
        } catch (err) {
            setError("Failed to initiate funding");
        } finally {
            setLoading(false);
        }
    };

    // Filtered transactions
    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch =
            tx.type?.toLowerCase().includes(search.toLowerCase()) ||
            tx.status?.toLowerCase().includes(search.toLowerCase());
        const matchesType =
            filterType === "all" ||
            (filterType === "credit" && tx.amount > 0) ||
            (filterType === "debit" && tx.amount < 0);
        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "success" && tx.status === "success") ||
            (filterStatus === "pending" && tx.status === "pending") ||
            (filterStatus === "failed" && tx.status === "failed");
        return matchesSearch && matchesType && matchesStatus;
    });

    // Download CSV logic
    const handleDownloadCSV = () => {
        if (!transactions.length) return;
        const header = ['Date/Time', 'Type', 'Amount', 'Status', 'Transaction ID'];
        const rows = transactions.map(tx => [
            new Date(tx.createdAt).toLocaleString(),
            tx.type || (tx.amount > 0 ? 'Credit' : 'Debit'),
            `₦ ${Math.abs(tx.amount)}`,
            tx.status,
            tx.id || tx._id
        ]);
        const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transaction_history.csv';
        a.click();
        URL.revokeObjectURL(url);
        setShowToast({ type: 'success', message: 'Transaction history downloaded!' });
        setTimeout(() => setShowToast(null), 3000);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">My Wallet</h1>
            {/* Toast notification */}
            {showToast && (
                <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white ${showToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{showToast.message}</div>
            )}
            <div className="bg-gradient-to-tr from-blue-100 to-blue-50 shadow-md rounded-xl p-8 w-full mb-8 flex flex-row items-center gap-4 h-40 min-h-[10rem]">
                {/* Wallet Balance (left) */}
                <div className="flex-1 flex flex-row items-center gap-3 min-w-0 h-full">
                    <WalletIcon className="w-10 h-10 text-blue-600 bg-white rounded-full shadow p-2" />
                    <div className="min-w-0">
                        <h2 className="text-xl font-semibold mb-1">Wallet Balance</h2>
                        <p className="text-3xl font-bold truncate">{loading ? <span className="animate-spin inline-block"><ArrowDownTrayIcon className="w-6 h-6 text-blue-400" /></span> : `₦ ${balance?.toFixed(2)}`}</p>
                    </div>
                </div>
                {/* Add Funds and Download (right) */}
                <div className="flex-1 flex flex-row justify-end gap-4 h-full">
                    <button
                        className="flex-1 flex items-center justify-center bg-green-600 text-white px-4 py-2 h-full rounded-lg shadow-md hover:bg-green-700 transition text-sm min-w-[120px]"
                        onClick={() => setShowModal(true)}
                        title="Add funds to your wallet"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> Add Funds
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center bg-gray-700 text-white px-4 py-2 h-full rounded-lg shadow-md hover:bg-gray-800 transition text-sm min-w-[120px]"
                        onClick={handleDownloadCSV}
                        title="Download transaction history as CSV"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> Download Transaction History
                    </button>
                </div>
            </div>
            {/* Add Funds Modal (existing) */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-2">Add Funds</h3>
                        <form onSubmit={handleAddFunds}>
                            <input
                                type="number"
                                min="100"
                                className="border p-2 rounded w-full mb-4"
                                placeholder="Enter amount (NGN)"
                                value={amount}
                                onChange={e => setAmount(Number(e.target.value))}
                                required
                            />
                            {error && <p className="text-red-500 mb-2">{error}</p>}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Proceed to Paystack"}
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="mt-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                    <div className="flex flex-wrap gap-2 items-center">
                        <input
                            type="text"
                            className="border rounded px-3 py-1 text-sm"
                            placeholder="Search by type or status..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="success">Success</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
                {txLoading ? (
                    <div className="flex items-center justify-center min-h-[100px]">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                ) : txError ? (
                    <div className="text-red-600 text-center py-4">{txError}</div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-gray-500 text-center py-4">No transactions yet.</div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTransactions.map((tx: any) => (
                                    <tr key={tx.id || tx._id} className="hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedTx(tx)}>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.createdAt).toLocaleString()}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap capitalize font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{tx.type || (tx.amount > 0 ? 'Credit' : 'Debit')}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>₦ {Math.abs(tx.amount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'success' ? 'bg-green-100 text-green-800' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>{tx.status?.charAt(0).toUpperCase() + tx.status?.slice(1)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Transaction Details Modal */}
            {selectedTx && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">Transaction Details <InformationCircleIcon className="w-5 h-5 text-blue-500" /></h3>
                        <div className="mb-2"><span className="font-semibold">Date/Time:</span> {new Date(selectedTx.createdAt).toLocaleString()}</div>
                        <div className="mb-2"><span className="font-semibold">Type:</span> {selectedTx.type || (selectedTx.amount > 0 ? 'Credit' : 'Debit')}</div>
                        <div className="mb-2"><span className="font-semibold">Amount:</span> ₦ {Math.abs(selectedTx.amount)}</div>
                        <div className="mb-2"><span className="font-semibold">Status:</span> {selectedTx.status}</div>
                        <div className="mb-2"><span className="font-semibold">Transaction ID:</span> {selectedTx.id || selectedTx._id}</div>
                        <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 w-full mt-4"
                            onClick={() => setSelectedTx(null)}
                        >Close</button>
                    </div>
                </div>
            )}
        </div>
    );
} 