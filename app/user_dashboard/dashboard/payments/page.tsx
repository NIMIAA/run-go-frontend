"use client";
import { useEffect, useState } from "react";
import { getUserData } from "@/app/utils/auth";

const PAYMENT_TYPES = ["all", "credit", "debit"];
const PAYMENT_STATUSES = ["all", "success", "pending", "failed"];

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString();
}

function downloadCSV(payments: any[]) {
    const header = ["Date/Time", "Type", "Amount", "Status", "Reference", "Description"];
    const rows = payments.map(tx => [
        formatDate(tx.createdAt),
        tx.type || (tx.amount > 0 ? "Credit" : "Debit"),
        `₦ ${Math.abs(tx.amount)}`,
        tx.status,
        tx.id || tx._id,
        tx.description
    ]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment_history.csv';
    a.click();
    URL.revokeObjectURL(url);
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showToast, setShowToast] = useState<string | null>(null);
    const [selectedTx, setSelectedTx] = useState<any | null>(null);

    const user = getUserData();
    const userIdentifier = user?.email;

    const fetchPayments = async () => {
        if (!userIdentifier || typeof userIdentifier !== 'string') return;
        try {
            setLoading(true);
            setError(null);
            let url = `http://localhost:5000/v1/wallet/transactions?userIdentifier=${userIdentifier}&page=${page}&limit=${limit}`;
            if (filterType !== "all") url += `&type=${filterType}`;
            if (filterStatus !== "all") url += `&status=${filterStatus}`;
            if (dateFrom) url += `&from=${dateFrom}`;
            if (dateTo) url += `&to=${dateTo}`;
            if (search) url += `&search=${encodeURIComponent(search)}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch payments");
            const data = await res.json();
            if (Array.isArray(data)) {
                setPayments(data);
                setTotal(data.length < limit && page === 1 ? data.length : 0);
            } else {
                setPayments(Array.isArray(data.transactions) ? data.transactions : []);
                setTotal(typeof data.total === 'number' ? data.total : 0);
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [userIdentifier, page, limit, filterType, filterStatus, dateFrom, dateTo, search]);

    // Filtered payments (client-side fallback for search)
    const filteredPayments = payments.filter(tx => {
        const matchesType = filterType === "all" || (tx.type === filterType) || (filterType === "credit" && tx.amount > 0) || (filterType === "debit" && tx.amount < 0);
        const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
        const matchesSearch = search === "" || tx.description?.toLowerCase().includes(search.toLowerCase()) || (tx.id || tx._id)?.toLowerCase().includes(search.toLowerCase());
        let matchesDate = true;
        if (dateFrom) matchesDate = matchesDate && new Date(tx.createdAt) >= new Date(dateFrom);
        if (dateTo) matchesDate = matchesDate && new Date(tx.createdAt) <= new Date(dateTo);
        return matchesType && matchesStatus && matchesSearch && matchesDate;
    });

    // Toast for export
    const handleExport = () => {
        downloadCSV(filteredPayments);
        setShowToast("Payment history downloaded!");
        setTimeout(() => setShowToast(null), 3000);
    };

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-4">Payment History</h1>
            {showToast && (
                <div className="fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white bg-green-600">{showToast}</div>
            )}
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
                <input
                    type="text"
                    className="border rounded px-3 py-1 text-sm"
                    placeholder="Search by description or reference..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="border rounded px-2 py-1 text-sm"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                >
                    {PAYMENT_TYPES.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                </select>
                <select
                    className="border rounded px-2 py-1 text-sm"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    {PAYMENT_STATUSES.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                </select>
                <input
                    type="date"
                    className="border rounded px-2 py-1 text-sm"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                />
                <input
                    type="date"
                    className="border rounded px-2 py-1 text-sm"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                />
                <button
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
                    onClick={handleExport}
                >
                    Export CSV
                </button>
            </div>
            {loading ? (
                <div className="flex items-center justify-center min-h-[100px]">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-red-600 text-center py-4">{error}</div>
            ) : filteredPayments.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                    <div className="text-2xl mb-2">🧾</div>
                    <div>No payments found.<br />Fund your wallet or take a ride to see payment history.</div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPayments.map((tx: any) => (
                                    <tr key={tx.id || tx._id} className="hover:bg-blue-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(tx.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap capitalize">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${tx.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{tx.type || (tx.amount > 0 ? 'Credit' : 'Debit')}</span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>₦ {Math.abs(tx.amount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'success' ? 'bg-green-100 text-green-800' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>{tx.status?.charAt(0).toUpperCase() + tx.status?.slice(1)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{tx.id || tx._id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{tx.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-blue-600 underline text-xs" onClick={() => setSelectedTx(tx)}>View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span className="text-sm">Page {page}{total > 0 ? ` of ${Math.ceil(total / limit)}` : ''}</span>
                        <button
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => setPage(p => p + 1)}
                            disabled={filteredPayments.length < limit || (total > 0 && page >= Math.ceil(total / limit))}
                        >
                            Next
                        </button>
                    </div>
                    {/* Details Modal */}
                    {selectedTx && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">Payment Details</h3>
                                <div className="mb-2"><span className="font-semibold">Date/Time:</span> {formatDate(selectedTx.createdAt)}</div>
                                <div className="mb-2"><span className="font-semibold">Type:</span> {selectedTx.type || (selectedTx.amount > 0 ? 'Credit' : 'Debit')}</div>
                                <div className="mb-2"><span className="font-semibold">Amount:</span> ₦ {Math.abs(selectedTx.amount)}</div>
                                <div className="mb-2"><span className="font-semibold">Status:</span> {selectedTx.status}</div>
                                <div className="mb-2"><span className="font-semibold">Reference:</span> <span className="font-mono">{selectedTx.id || selectedTx._id}</span> <button className="ml-2 text-xs text-blue-600 underline" onClick={() => { navigator.clipboard.writeText(selectedTx.id || selectedTx._id) }}>Copy</button></div>
                                <div className="mb-2"><span className="font-semibold">Description:</span> {selectedTx.description}</div>
                                <button
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 w-full mt-4"
                                    onClick={() => setSelectedTx(null)}
                                >Close</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}