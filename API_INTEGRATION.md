# RUNGO Driver Authentication API Integration Guide

## Overview
This guide provides complete implementation details for integrating the driver authentication APIs into your frontend application.

## Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## API Endpoints

### Base URL
- Development: `http://localhost:5000`
- Production: `https://your-api-domain.com`

### Driver Authentication Endpoints

#### 1. Driver Registration
**POST** `/v1/driver/auth/register`

**Request Body:**
```json
{
  "email": "driver@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+2348012345678",
  "password": "StrongPassword123!",
  "carIdentifier": "ABC123XYZ"
}
```

**Response (201):**
```json
{
  "message": "Driver registration initiated successfully. Please check your email to verify your account and complete registration.",
  "data": {
    "email": "driver@example.com",
    "message": "Verification email sent"
  }
}
```

#### 2. Verify Registration OTP
**POST** `/v1/driver/auth/verify`

**Request Body:**
```json
{
  "email": "driver@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email verified and account created successfully",
  "data": {
    "email": "driver@example.com",
    "identifier": "01HXYZ123456789",
    "message": "You can now login to your account"
  }
}
```

#### 3. Resend Verification Email
**POST** `/v1/driver/auth/resend-verification`

**Request Body:**
```json
{
  "email": "driver@example.com"
}
```

**Response (200):**
```json
{
  "message": "Verification email resent successfully",
  "data": {
    "email": "driver@example.com",
    "message": "Check your email for the new verification code"
  }
}
```

#### 4. Driver Login
**POST** `/v1/driver/auth/login`

**Request Body:**
```json
{
  "email": "driver@example.com",
  "password": "StrongPassword123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "driver": {
      "identifier": "01HXYZ123456789",
      "email": "driver@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+2348012345678",
      "carIdentifier": "ABC123XYZ",
      "isVerified": true,
      "isAvailable": true,
      "completedRides": 0,
      "averageRating": 0
    }
  }
}
```

#### 5. Password Reset Flow

**Step 1: Request Password Reset**
**POST** `/v1/driver/auth/forgot-password`

**Request Body:**
```json
{
  "email": "driver@example.com"
}
```

**Step 2: Verify OTP**
**POST** `/v1/driver/auth/verify-otp`

**Request Body:**
```json
{
  "email": "driver@example.com",
  "otp": "123456"
}
```

**Step 3: Reset Password**
**POST** `/v1/driver/auth/reset-password`

**Request Body:**
```json
{
  "email": "driver@example.com",
  "otp": "123456",
  "newPassword": "NewStrongPassword123!"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "EMAIL_NOT_VERIFIED",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "No pending registration found for this email",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "A driver with this email already exists.",
  "error": "Conflict"
}
```

### 422 Unprocessable Entity
```json
{
  "statusCode": 422,
  "message": "Invalid OTP",
  "error": "Unprocessable Entity"
}
```

## Authentication Requirements

- **Protected Routes**: Most endpoints require JWT authentication
- **Token Format**: `Authorization: Bearer <jwt_token>`
- **Account Type**: Token must have `accountType: 'driver'`

## Frontend Implementation

### API Service (`app/utils/api.ts`)
The API service has been implemented with:
- TypeScript interfaces for all request/response types
- Error handling with custom `ApiError` class
- JWT token management utilities
- Rate limiting and validation error handling

### Components Updated
1. **Driver Signup Page** (`app/authentication/drivers-signup/page.tsx`)
   - Integrated with registration API
   - Stores email in session storage for OTP verification
   - Proper error handling and validation

2. **Driver OTP Verification Page** (`app/authentication/drivers-verify-otp/page.tsx`)
   - Integrated with OTP verification API
   - Resend OTP functionality
   - Redirects to login after successful verification

3. **Driver Login Page** (`app/authentication/drivers-login/page.tsx`)
   - Integrated with login API
   - Stores JWT token in localStorage
   - Redirects to dashboard after successful login

## Usage Examples

### Registration Flow
```typescript
import { driverAuthAPI } from '@/app/utils/api';

// 1. Register driver
const registrationData = {
  email: "driver@example.com",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+2348012345678",
  password: "StrongPassword123!",
  carIdentifier: "ABC123XYZ"
};

const response = await driverAuthAPI.registerDriver(registrationData);
// Store email in session storage for OTP verification
sessionStorage.setItem('driverRegistrationEmail', registrationData.email);
```

### OTP Verification
```typescript
// 2. Verify OTP
const email = sessionStorage.getItem('driverRegistrationEmail');
const otpResponse = await driverAuthAPI.verifyOTP({
  email: email!,
  otp: "123456"
});

// Clear session storage after successful verification
sessionStorage.removeItem('driverRegistrationEmail');
```

### Login
```typescript
// 3. Login
const loginResponse = await driverAuthAPI.loginDriver({
  email: "driver@example.com",
  password: "StrongPassword123!"
});

// Store JWT token
setAuthToken(loginResponse.data!.jwtToken);
```

## Security Considerations

1. **JWT Token Storage**: Tokens are stored in localStorage for persistence
2. **Session Management**: Email is stored in sessionStorage for OTP verification
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Input Validation**: Both client-side and server-side validation
5. **Rate Limiting**: API handles rate limiting for OTP requests

## Testing

To test the API integration:

1. Start your backend server on `http://localhost:5000`
2. Set the environment variable: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`
3. Navigate to `/authentication/drivers-signup` to test registration
4. Check email for OTP and verify on `/authentication/drivers-verify-otp`
5. Login on `/authentication/drivers-login`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from your frontend domain
2. **Network Errors**: Check if backend server is running and accessible
3. **Validation Errors**: Ensure all required fields are properly formatted
4. **JWT Token Issues**: Check token expiration and format

### Debug Mode
Enable debug logging by adding to your environment:
```env
NEXT_PUBLIC_DEBUG=true
```

This will log API requests and responses to the console for debugging purposes. 