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