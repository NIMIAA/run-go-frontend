"use client";
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { createDriverSocket } from "@/app/utils/socket";
import { getDriverAuthToken } from "@/app/utils/driverAuth";

interface RideRequest {
    identifier: string;
    userIdentifier: string;
    pickupLocation: string;
    destination: string;
    estimatedAmount: number;
    status: string;
    createdAt: string;
    respondedAt?: string;
}

interface DriverSocketContextType {
    socket: ReturnType<typeof createDriverSocket> | null;
    currentRideRequest: RideRequest | null;
    setCurrentRideRequest: (ride: RideRequest | null) => void;
    sendRideResponse: (rideId: string, response: "accepted" | "rejected") => void;
}

const DriverSocketContext = createContext<DriverSocketContextType | undefined>(undefined);

export function useDriverSocket() {
    const ctx = useContext(DriverSocketContext);
    if (!ctx) throw new Error("useDriverSocket must be used within DriverSocketProvider");
    return ctx;
}

export function DriverSocketProvider({ children }: { children: ReactNode }) {
    const [currentRideRequest, setCurrentRideRequest] = useState<RideRequest | null>(null);
    const [socket, setSocket] = useState<ReturnType<typeof createDriverSocket> | null>(null);
    const tokenRef = useRef<string | null>(null);

    useEffect(() => {
        const token = getDriverAuthToken();
        tokenRef.current = token;
        if (!token) return;
        const sock = createDriverSocket(token);
        setSocket(sock);
        sock.connect();

        sock.on("connect", () => {
            console.log("Socket connected", sock.id);
        });
        sock.on("disconnect", () => {
            console.log("Socket disconnected");
        });
        sock.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });
        sock.on("new_ride_request", (ride: RideRequest) => {
            setCurrentRideRequest(ride);
        });
        sock.on("ride_request_expired", (rideId: string) => {
            if (currentRideRequest?.identifier === rideId) setCurrentRideRequest(null);
        });
        sock.on("ride_accepted", (rideId: string) => {
            if (currentRideRequest?.identifier === rideId) setCurrentRideRequest(null);
        });
        sock.on("ride_rejected", (rideId: string) => {
            if (currentRideRequest?.identifier === rideId) setCurrentRideRequest(null);
        });

        return () => {
            sock.disconnect();
            sock.removeAllListeners();
        };
        // eslint-disable-next-line
    }, []);

    const sendRideResponse = (rideId: string, response: "accepted" | "rejected") => {
        if (socket) {
            socket.emit("ride_response", { rideId, response });
        }
    };

    return (
        <DriverSocketContext.Provider value={{ socket, currentRideRequest, setCurrentRideRequest, sendRideResponse }}>
            {children}
        </DriverSocketContext.Provider>
    );
} 