import axios from "axios";
import { setupAuthInterceptor } from "./auth";

const BASE_URL = "http://localhost:5000/v1";

// Setup auth interceptor
setupAuthInterceptor(axios);

// Types for API requests and responses
export interface RegisterData {
    isStudent: boolean;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    matricNumber?: string;
}

export interface LoginData {
    isStudent: boolean;
    matricNumber?: string;
    email?: string;
    password: string;
}

export interface VerifyRegistrationData {
    email: string;
    otp: string;
}

export interface ResendVerificationData {
    email: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    code?: string;
}

// API Functions
export async function initiateRegistration(data: RegisterData): Promise<ApiResponse> {
    try {
        const res = await axios.post(`${BASE_URL}/user/auth/register`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Registration initiation failed"
        );
    }
}

export async function verifyRegistration(data: VerifyRegistrationData): Promise<ApiResponse> {
    try {
        const res = await axios.post(`${BASE_URL}/user/auth/verify-registration`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Registration verification failed"
        );
    }
}

export async function resendRegistrationVerification(data: ResendVerificationData): Promise<ApiResponse> {
    try {
        const res = await axios.post(`${BASE_URL}/user/auth/resend-registration-verification`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to resend verification"
        );
    }
}

export async function loginUser(data: LoginData): Promise<ApiResponse> {
    try {
        const res = await axios.post(`${BASE_URL}/user/auth/login`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Login failed"
        );
    }
}

export async function verifyEmail(data: VerifyRegistrationData): Promise<ApiResponse> {
    try {
        const res = await axios.post(`${BASE_URL}/user/auth/verify-email`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Email verification failed"
        );
    }
}

export async function resendVerification(data: ResendVerificationData): Promise<ApiResponse> {
    try {
        const res = await axios.post(`${BASE_URL}/user/auth/resend-verification`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to resend verification"
        );
    }
}

export async function forgotPassword(data: { email: string }): Promise<ApiResponse> {
    try {
        const res = await axios.post(`${BASE_URL}/user/auth/forgot-password`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to send reset email"
        );
    }
}

export async function verifyOtp(data: { email: string; otp: string }): Promise<ApiResponse> {
    try {
        const res = await axios.post(`${BASE_URL}/user/auth/verify-otp`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Invalid OTP"
        );
    }
}

export async function resetPassword(data: {
    email: string;
    newPassword: string;
    confirmPassword: string;
}): Promise<ApiResponse> {
    try {
        const res = await axios.post(`${BASE_URL}/user/auth/set-password`, data);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Password reset failed"
        );
    }
}

// Profile Image API Functions
export interface ProfileData {
    identifier: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
    profileImagePath?: string;
}

export async function uploadProfileImage(file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(`${BASE_URL}/user/profile/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Image upload failed"
        );
    }
}

export async function getUserProfile(): Promise<ApiResponse<ProfileData>> {
    try {
        const res = await axios.get(`${BASE_URL}/user/profile`);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to fetch profile"
        );
    }
}

export async function deleteProfileImage(): Promise<ApiResponse<{ message: string }>> {
    try {
        const res = await axios.delete(`${BASE_URL}/user/profile/image`);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to delete image"
        );
    }
}

// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const DRIVER_AUTH_ENDPOINTS = '/v1/driver/auth';

// API Response Types
export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    statusCode?: number;
    error?: string;
}

export interface DriverRegistrationRequest {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    carIdentifier: string;
}

export interface DriverRegistrationResponse {
    email: string;
    message: string;
}

export interface OTPVerificationRequest {
    email: string;
    otp: string;
}

export interface OTPVerificationResponse {
    email: string;
    identifier: string;
    message: string;
}

export interface DriverLoginRequest {
    email: string;
    password: string;
}

export interface Driver {
    identifier: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    carIdentifier: string;
    isVerified: boolean;
    isAvailable: boolean;
    completedRides: number;
    averageRating: number;
}

export interface DriverLoginResponse {
    jwtToken: string;
    driver: Driver;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetVerifyRequest {
    email: string;
    otp: string;
}

export interface PasswordResetConfirmRequest {
    email: string;
    newPassword: string;
    confirmPassword: string;
}

// API Error Types
export class ApiError extends Error {
    statusCode: number;
    error: string;

    constructor(message: string, statusCode: number, error: string) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.name = 'ApiError';
    }
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response): Promise<any> => {
    const data = await response.json();

    if (!response.ok) {
        throw new ApiError(
            data.message || 'An error occurred',
            data.statusCode || response.status,
            data.error || 'Unknown Error'
        );
    }

    return data;
};

// API Service Class
export class DriverAuthAPI {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Helper method to make API calls
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        const finalOptions = {
            ...defaultOptions,
            ...options,
        };

        const response = await fetch(url, finalOptions);

        return handleApiResponse(response);
    }

    // Driver Registration
    async registerDriver(data: DriverRegistrationRequest): Promise<ApiResponse<DriverRegistrationResponse>> {
        return this.makeRequest<DriverRegistrationResponse>(
            `${DRIVER_AUTH_ENDPOINTS}/register`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    }

    // Verify OTP
    async verifyOTP(data: OTPVerificationRequest): Promise<ApiResponse<OTPVerificationResponse>> {
        return this.makeRequest<OTPVerificationResponse>(
            `${DRIVER_AUTH_ENDPOINTS}/verify-registration`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    }

    // Resend Verification Email
    async resendVerification(email: string): Promise<ApiResponse<{ email: string; message: string }>> {
        return this.makeRequest<{ email: string; message: string }>(
            `${DRIVER_AUTH_ENDPOINTS}/resend-verification`,
            {
                method: 'POST',
                body: JSON.stringify({ email }),
            }
        );
    }

    // Driver Login
    async loginDriver(data: DriverLoginRequest): Promise<ApiResponse<DriverLoginResponse>> {
        return this.makeRequest<DriverLoginResponse>(
            `${DRIVER_AUTH_ENDPOINTS}/login`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    }

    // Forgot Password
    async forgotPassword(email: string): Promise<ApiResponse<{ email: string; message: string }>> {
        return this.makeRequest<{ email: string; message: string }>(
            `${DRIVER_AUTH_ENDPOINTS}/forgot-password`,
            {
                method: 'POST',
                body: JSON.stringify({ email }),
            }
        );
    }

    // Verify OTP for Password Reset
    async verifyPasswordResetOTP(data: PasswordResetVerifyRequest): Promise<ApiResponse<{ email: string; message: string }>> {
        return this.makeRequest<{ email: string; message: string }>(
            `${DRIVER_AUTH_ENDPOINTS}/verify-otp`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    }

    // Reset Password
    async resetPassword(data: PasswordResetConfirmRequest): Promise<ApiResponse<{ email: string; message: string }>> {
        return this.makeRequest<{ email: string; message: string }>(
            '/v1/driver/auth/reset-password',
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    }

    // Get Driver Profile (Protected Route)
    async getDriverProfile(token: string): Promise<ApiResponse<Driver>> {
        return this.makeRequest<Driver>(
            `${DRIVER_AUTH_ENDPOINTS}/profile`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    }
}

// Create and export a singleton instance
export const driverAuthAPI = new DriverAuthAPI();

// Utility functions for common operations
export const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('driverAuthToken', token);
    }
};

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('driverAuthToken');
    }
    return null;
};

export const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('driverAuthToken');
    }
};

export const isAuthenticated = (): boolean => {
    return getAuthToken() !== null;
};

// Error message mapping
export const getErrorMessage = (error: ApiError): string => {
    switch (error.statusCode) {
        case 400:
            return 'Please check your input and try again.';
        case 401:
            if (error.message === 'EMAIL_NOT_VERIFIED') {
                return 'Please verify your email before logging in.';
            }
            return 'Invalid credentials. Please try again.';
        case 404:
            return 'Account not found. Please check your email or register.';
        case 409:
            return 'An account with this email already exists.';
        case 422:
            return 'Invalid verification code. Please try again.';
        case 429:
            return 'Too many requests. Please wait a moment and try again.';
        case 500:
            return 'Server error. Please try again later.';
        default:
            return error.message || 'An unexpected error occurred.';
    }
};

// Fetch ride history for a driver
export async function getDriverRideHistory(driverIdentifier: string, page = 1, limit = 10) {
    try {
        // Remove any trailing slash from the base URL
        const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
        const res = await fetch(`${baseUrl}/v1/booking/driver-requests/${driverIdentifier}?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error('Failed to fetch ride history');
        return await res.json();
    } catch (error) {
        throw error;
    }
} 