"use client";
import { useState } from "react";
import { driverAuthAPI } from "@/app/utils/api";

export default function ApiTest() {
    const [testResults, setTestResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testApiConnection = async () => {
        setIsLoading(true);
        setTestResults([]);

        try {
            addResult("🔍 Starting API connection test...");

            // Test 1: Check environment variables
            addResult(`📋 API Base URL: ${process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}`);

            // Test 2: Try to make a simple request to check connectivity
            addResult("🌐 Testing API connectivity...");

            const testEmail = "test@example.com";
            const testData = {
                email: testEmail,
                firstName: "Test",
                lastName: "User",
                phoneNumber: "+2348012345678",
                password: "TestPassword123!",
                carIdentifier: "TEST123"
            };

            addResult("📤 Attempting registration request...");

            try {
                const response = await driverAuthAPI.registerDriver(testData);
                addResult(`✅ Registration API call successful: ${response.message}`);
            } catch (error: any) {
                if (error instanceof Error) {
                    addResult(`❌ Registration API call failed: ${error.message}`);
                    if (error.message.includes("fetch")) {
                        addResult("🔧 This suggests a network connectivity issue or backend server is not running");
                    }
                }
            }

            // Test 3: Check session storage
            addResult("💾 Checking session storage...");
            const storedEmail = sessionStorage.getItem('driverRegistrationEmail');
            addResult(`📧 Stored email: ${storedEmail || 'None'}`);

            // Test 4: Check localStorage
            addResult("💾 Checking localStorage...");
            const authToken = localStorage.getItem('driverAuthToken');
            addResult(`🔑 Auth token: ${authToken ? 'Present' : 'None'}`);

        } catch (error) {
            addResult(`❌ Test failed: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">🔧 API Debug Tool</h3>
                <button
                    onClick={clearResults}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                    Clear
                </button>
            </div>

            <button
                onClick={testApiConnection}
                disabled={isLoading}
                className="w-full mb-3 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded disabled:opacity-50"
            >
                {isLoading ? "Testing..." : "Test API Connection"}
            </button>

            <div className="max-h-40 overflow-y-auto">
                {testResults.map((result, index) => (
                    <div key={index} className="text-xs text-gray-600 mb-1">
                        {result}
                    </div>
                ))}
            </div>

            {testResults.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-2">
                    Click "Test API Connection" to start debugging
                </div>
            )}
        </div>
    );
} 