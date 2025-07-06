This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

### Authentication System
- **User Registration**: Complete signup flow with comprehensive validation
  - Student/non-student toggle with conditional matric number field
  - Real-time password strength indicator
  - Email format and phone number validation
  - Password confirmation matching
  - Form validation with error feedback
- **Email Verification**: Complete verification flow with resend functionality
  - 6-digit OTP input with auto-focus
  - Resend verification with rate limiting (3 attempts per 5 minutes)
  - 60-second countdown timer
  - Success/error state handling
- **User Login**: Enhanced login with email verification check
  - Student (matric number) and non-student (email) login options
  - Email verification requirement enforcement
  - JWT token storage and management
  - Automatic redirect on authentication errors
- **Password Reset**: Complete forgot password flow with OTP verification
- **Protected Routes**: Authentication middleware for dashboard access

### Security Features
- Email verification required for account activation
- Password strength requirements (8+ chars, uppercase, lowercase, number, special char)
- Rate limiting on OTP resend (3 attempts per 5 minutes)
- JWT token-based authentication
- Automatic token refresh and logout on 401 errors
- Form validation and error handling
- Secure API integration with backend
- Client-side validation with server-side enforcement

### User Experience Features
- Loading states for all API calls
- Real-time form validation feedback
- Success/error message displays
- Responsive design for mobile and desktop
- Accessibility features (ARIA labels, keyboard navigation)
- Smooth transitions and animations
- Auto-focus on OTP input
- Auto-submit on Enter key
- Clear step indicators (Registration → Email Verification → Login)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
