"use client";
import { useEffect, useState } from "react";
import { isDriverAuthenticated } from "@/app/utils/driverAuth";
import { useRouter } from "next/navigation";

interface DriverProtectedRouteProps {
    children: React.ReactNode;
}

export default function DriverProtectedRoute({ children }: DriverProtectedRouteProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = isDriverAuthenticated();
            setIsAuthenticated(authenticated);
            setIsLoading(false);

            if (!authenticated) {
                router.push('/authentication/drivers-login');
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
} 