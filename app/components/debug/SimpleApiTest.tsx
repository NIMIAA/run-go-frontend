"use client";
import { useState } from "react";

export default function SimpleApiTest() {
    const [isLoading, setIsLoading] = useState(false);

    const testBackendConnection = async () => {
        setIsLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
            alert(`🔍 Testing backend connection to: ${baseUrl}`);

            // Test 1: Check if server is reachable
            try {
                const response = await fetch(`${baseUrl}/health`);
                if (response.ok) {
                    alert('✅ Backend server is reachable!');
                } else {
                    alert(`⚠️ Backend server responded with status: ${response.status}`);
                }
            } catch (error) {
                alert(`❌ Cannot reach backend server: ${error}`);
                return;
            }

            // Test 2: Test registration endpoint
            const testData = {
                email: "test@example.com",
                firstName: "Test",
                lastName: "User",
                phoneNumber: "+2348012345678",
                password: "TestPassword123!",
                carIdentifier: "TEST123"
            };

            alert('📤 Testing registration endpoint...');

            try {
                const regResponse = await fetch(`${baseUrl}/v1/driver/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(testData)
                });

                const regData = await regResponse.json();
                alert(`📋 Registration Response:\nStatus: ${regResponse.status}\nMessage: ${regData.message || 'No message'}\nData: ${JSON.stringify(regData.data || {}, null, 2)}`);

                if (regResponse.ok) {
                    // Test 3: Test OTP verification endpoint
                    alert('🔐 Testing OTP verification endpoint...');

                    const otpData = {
                        email: "test@example.com",
                        otp: "123456"
                    };

                    const otpResponse = await fetch(`${baseUrl}/v1/driver/auth/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(otpData)
                    });

                    const otpResult = await otpResponse.json();
                    alert(`🔐 OTP Verification Response:\nStatus: ${otpResponse.status}\nMessage: ${otpResult.message || 'No message'}\nError: ${otpResult.error || 'None'}`);

                }

            } catch (error) {
                alert(`❌ Registration test failed: ${error}`);
            }

        } catch (error) {
            alert(`❌ Test failed: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testCurrentEmail = async () => {
        const email = sessionStorage.getItem('driverRegistrationEmail');
        if (!email) {
            alert('❌ No email found in session storage!');
            return;
        }

        alert(`📧 Testing with current email: ${email}`);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

        try {
            const otpData = {
                email: email,
                otp: "123456"
            };

            alert('🔐 Testing OTP verification with current email...');

            const response = await fetch(`${baseUrl}/v1/driver/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(otpData)
            });

            const result = await response.json();
            alert(`🔐 OTP Verification Result:\nStatus: ${response.status}\nMessage: ${result.message || 'No message'}\nError: ${result.error || 'None'}\nStatusCode: ${result.statusCode || 'None'}`);

        } catch (error) {
            alert(`❌ OTP test failed: ${error}`);
        }
    };

    const checkEndpoints = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const endpoints = [
            '/health',
            '/v1/driver/auth/register',
            '/v1/driver/auth/verify',
            '/v1/driver/auth/resend-verification',
            '/v1/driver/auth/login'
        ];

        let results = `🔍 Endpoint Check Results:\nBase URL: ${baseUrl}\n\n`;

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${baseUrl}${endpoint}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                results += `${endpoint}: ${response.status} ${response.statusText}\n`;
            } catch (error) {
                results += `${endpoint}: ❌ ${error}\n`;
            }
        }

        alert(results);
    };

    return (
        <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">🚨 Quick API Test</h3>

            <div className="space-y-2">
                <button
                    onClick={testBackendConnection}
                    disabled={isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded disabled:opacity-50"
                >
                    {isLoading ? "Testing..." : "Test Backend Connection"}
                </button>

                <button
                    onClick={testCurrentEmail}
                    disabled={isLoading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded disabled:opacity-50"
                >
                    Test Current Email OTP
                </button>

                <button
                    onClick={checkEndpoints}
                    disabled={isLoading}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs py-2 px-3 rounded disabled:opacity-50"
                >
                    Check All Endpoints
                </button>
            </div>

            <div className="mt-3 text-xs text-gray-600">
                <p>Email: {sessionStorage.getItem('driverRegistrationEmail') || 'Not found'}</p>
                <p>API URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}</p>
            </div>
        </div>
    );
} 