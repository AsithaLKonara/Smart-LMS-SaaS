# Phase 3.2: Authentication Pages - Detailed Implementation Plan

**Objective:** Create login, registration, tenant signup, and password reset pages with modern dark UI and proper validation.

---

## Step 1: Login Page

### 1.1 Create Login Page
- **Location:** `app/(auth)/login/page.tsx`
- **Features:**
  - Centered card layout
  - Email input
  - Password input
  - "Remember me" checkbox
  - Login button
  - "Forgot password" link
  - "Sign up" link
  - Inline error messages
  - Loading state

### 1.2 Login Form Component
- **Location:** `components/auth/LoginForm.tsx`
- **Features:**
  - Form validation (Zod)
  - Error handling
  - Success redirect
  - Tenant context support

**Files Created:**
- `app/(auth)/login/page.tsx`
- `components/auth/LoginForm.tsx`

---

## Step 2: Tenant Signup/Onboarding

### 2.1 Create Onboarding Flow
- **Location:** `app/(auth)/register/page.tsx`
- **Stepper UI with 4 steps:**
  1. Organization details (name, subdomain)
  2. Admin user creation (email, password, name)
  3. Plan selection (Free/Pro/Enterprise)
  4. Success screen with next steps

### 2.2 Stepper Component
- **Location:** `components/auth/Stepper.tsx`
- **Features:**
  - Progress indicator
  - Step navigation
  - Validation per step
  - Autosave (localStorage)

### 2.3 Onboarding Steps
- **Step 1 Component:** `components/auth/OnboardingStep1.tsx`
- **Step 2 Component:** `components/auth/OnboardingStep2.tsx`
- **Step 3 Component:** `components/auth/OnboardingStep3.tsx`
- **Step 4 Component:** `components/auth/OnboardingStep4.tsx`

**Files Created:**
- `app/(auth)/register/page.tsx`
- `components/auth/Stepper.tsx`
- `components/auth/OnboardingStep1.tsx`
- `components/auth/OnboardingStep2.tsx`
- `components/auth/OnboardingStep3.tsx`
- `components/auth/OnboardingStep4.tsx`

---

## Step 3: Forgot Password Flow

### 3.1 Forgot Password Page
- **Location:** `app/(auth)/forgot-password/page.tsx`
- **Features:**
  - Email input
  - Submit button
  - Back to login link
  - Success message after submission

### 3.2 Reset Password Page
- **Location:** `app/(auth)/reset-password/page.tsx`
- **Features:**
  - Token validation
  - New password input
  - Confirm password input
  - Submit button
  - Success redirect

**Files Created:**
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `components/auth/ForgotPasswordForm.tsx`
- `components/auth/ResetPasswordForm.tsx`

---

## Step 4: Email Verification

### 4.1 Verification Page
- **Location:** `app/(auth)/verify-email/page.tsx`
- **Features:**
  - Token validation
  - Success message
  - Resend verification email
  - Redirect to login

### 4.2 Verification API
- **Location:** `app/api/auth/verify-email/route.ts`
- **Functionality:**
  - Validate token
  - Update user emailVerified
  - Return success/error

**Files Created:**
- `app/(auth)/verify-email/page.tsx`
- `app/api/auth/verify-email/route.ts`

---

## Step 5: Form Validation

### 5.1 Create Validation Schemas
- **Location:** `lib/validation/auth.ts`
- **Schemas:**
  - Login schema
  - Register schema
  - Password reset schema
  - Email validation

### 5.2 Validation Utilities
- Use Zod for validation
- Custom error messages
- Client and server validation

**Files Created:**
- `lib/validation/auth.ts`

---

## Step 6: Auth Layout

### 6.1 Create Auth Layout
- **Location:** `app/(auth)/layout.tsx`
- **Features:**
  - Centered layout
  - Dark background
  - Logo/branding
  - No navigation

**Files Created:**
- `app/(auth)/layout.tsx`

---

## Deliverables Checklist

- [ ] Login page with form validation
- [ ] Tenant signup/onboarding with stepper UI
- [ ] Forgot password flow
- [ ] Reset password page
- [ ] Email verification page
- [ ] Form validation schemas
- [ ] Auth layout component
- [ ] All pages tested and working

---

## File Structure Summary

### Created Files:
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `app/(auth)/verify-email/page.tsx`
- `app/(auth)/layout.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/Stepper.tsx`
- `components/auth/OnboardingStep1.tsx`
- `components/auth/OnboardingStep2.tsx`
- `components/auth/OnboardingStep3.tsx`
- `components/auth/OnboardingStep4.tsx`
- `components/auth/ForgotPasswordForm.tsx`
- `components/auth/ResetPasswordForm.tsx`
- `app/api/auth/verify-email/route.ts`
- `lib/validation/auth.ts`

---

## Next Steps

After completing Phase 3.2, proceed to:
- **Phase 4.1**: Multi-Tenancy Core
- **Phase 4.2**: Student Dashboard

