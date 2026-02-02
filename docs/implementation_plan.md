# Security Enhancement Implementation Plan

## Goal
Upgrade the authentication mechanism for Admin APIs and Pages from insecure query parameter (ID-based) to secure **Firebase ID Token (Bearer Token)** verification.

## User Review Required
> [!IMPORTANT]
> This change impacts the internal logic of how the Frontend communicates with the Backend.
> There are no visual changes for the user, but **Admin pages will briefly fail** if the API is updated before the Frontend (or vice versa) during the deployment process.
> **Verification Strategy**: We will verify the fix by checking if `fetch` calls include the `Authorization` header and if the API rejects requests without it.

## Proposed Changes

### 1. Core Utilities
#### [MODIFY] [AuthContext.tsx](file:///c:/Users/jayit/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/roqkf/flower/src/contexts/AuthContext.tsx)
-   Add `getUserIdToken()` helper function to easily retrieve the current user's ID token.

#### [NEW] [auth-utils.ts](file:///c:/Users/jayit/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/roqkf/flower/src/lib/auth-utils.ts)
-   Create a server-side utility `verifyAdminToken(request)` to standardize token verification logic for API routes.

### 2. Backend (API Routes)
Refactor the following API routes to use `verifyAdminToken` instead of `searchParams.get('adminId')`:

#### [MODIFY] Admin Stats & Users
-   `src/app/api/dashboard/stats/route.ts`
-   `src/app/api/users/route.ts`
-   `src/app/api/users/me/route.ts` (if applicable)

#### [MODIFY] Content Management
-   `src/app/api/announcements/route.ts`
-   `src/app/api/announcements/[announcementId]/route.ts`
-   `src/app/api/inquiries/route.ts`
-   `src/app/api/inquiries/[inquiryId]/route.ts`

#### [MODIFY] Orders & Requests
-   `src/app/api/orders/route.ts`
-   `src/app/api/admin-requests/route.ts`
-   `src/app/api/admin-requests/[requestId]/route.ts`
-   `src/app/api/videos/route.ts` (if admin only)

### 3. Frontend (Admin Pages)
Update `fetch` calls in these pages to include `Authorization: Bearer <token>` header:
-   `src/app/admin/page.tsx` (Dashboard)
-   `src/app/admin/users/page.tsx`
-   `src/app/admin/orders/page.tsx`
-   `src/app/admin/requests/page.tsx`
-   `src/app/admin/inquiries/page.tsx`
-   `src/app/admin/announcements/page.tsx`
-   `src/app/admin/announcements/new/page.tsx`

## Verification Plan

### Automated Verification
- We cannot run automated browser tests in this environment easily.
- We will inspect the code to ensure `verifyAdminToken` is used and `Authorization` header is sent.

### Manual Verification
1.  **Login as Admin**: Ensure admin pages load data correctly.
2.  **Network Inspector**: Verify `fetch` requests allow `Authorization` header.
3.  **Negative Test**: Try assessing an API directly via browser address bar (should return 401/403).
