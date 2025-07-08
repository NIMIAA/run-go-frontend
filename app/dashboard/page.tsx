"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Build the query string
        const params = searchParams.toString();
        const target = `/user_dashboard/dashboard${params ? `?${params}` : ""}`;
        router.replace(target);
    }, [router, searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg text-gray-600">Redirecting to your dashboard...</div>
        </div>
    );
} 