"use client";
import React, { useState } from "react";
import { getDriverData } from "@/app/utils/driverAuth";
import axios from "axios";

const carTypes = ["keke", "shuttle", "camry", "sienna"];
const availabilityStatuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "under_maintenance", label: "Under Maintenance" },
];

export default function CarRegistrationPage() {
    const driver = getDriverData();
    const driverId = driver?.identifier;

    const [form, setForm] = useState({
        carName: "",
        carModel: "",
        carPlateNumber: "",
        carColor: "",
        capacity: 1,
        carType: "",
        availabilityStatus: "active"
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [registeredCar, setRegisteredCar] = useState<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);
        setError(null);
        setRegisteredCar(null);
        try {
            if (!driverId) {
                throw new Error("Driver ID not found. Please log in again.");
            }
            const url = `http://localhost:5000/v1/cars/${driverId}/register`;
            const res = await axios.post(url, form, {
                headers: { "Content-Type": "application/json" },
            });
            setSuccess("Car registered successfully!");
            setRegisteredCar(res.data);
            if (res.data && res.data.data) {
                setForm({
                    carName: res.data.data.carName || "",
                    carModel: res.data.data.carModel || "",
                    carPlateNumber: res.data.data.carPlateNumber || "",
                    carColor: res.data.data.carColor || "",
                    capacity: res.data.data.capacity || 1,
                    carType: res.data.data.carType || "",
                    availabilityStatus: res.data.data.availabilityStatus || "active"
                });
            }
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data?.message || JSON.stringify(err.response.data) || "Failed to register car");
            } else if (err.request) {
                setError("No response from server. Possible CORS or network error.");
            } else {
                setError(err.message || "Error registering car");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Register a Car</h1>
            {driverId ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Car Name</label>
                        <input
                            type="text"
                            name="carName"
                            value={form.carName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Car Model</label>
                        <input
                            type="text"
                            name="carModel"
                            value={form.carModel}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Car Plate Number</label>
                        <input
                            type="text"
                            name="carPlateNumber"
                            value={form.carPlateNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Car Color</label>
                        <input
                            type="text"
                            name="carColor"
                            value={form.carColor}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            value={form.capacity}
                            min={1}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Car Type</label>
                        <select
                            name="carType"
                            value={form.carType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        >
                            <option value="">Select car type</option>
                            {carTypes.map((type) => (
                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Availability Status</label>
                        <select
                            name="availabilityStatus"
                            value={form.availabilityStatus}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        >
                            {availabilityStatuses.map((status) => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register Car"}
                    </button>
                </form>
            ) : (
                <p className="text-red-600">Error: Driver ID not found. Please log in again.</p>
            )}
            {success && <p className="text-green-600 mt-4">{success}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
} 