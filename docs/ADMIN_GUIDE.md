
# Admin Guide - Smart LMS

Welcome to the admin panel. Manage your organization's configuration here.

## Overview

The Admin Dashboard provides a bird's-eye view of your LMS.
- **Total Users**: Number of registered users.
- **Tenants**: Active organizations.
- **Courses**: Total published courses across all tenants.
- **Metrics**: Track system health, storage usage, and API requests.

## User Management

1.  Navigate to **Users**.
2.  **Add User**: Click "New User" to manually add an account.
3.  **Roles**: Assign one of the following:
    - **Super Admin**: Full unrestricted access.
    - **Admin**: Tenant-level access.
    - **Instructor**: Can create and manage courses.
    - **Student**: Can enroll and learn.

## Tenant Management

Smart LMS is multi-tenant.
1.  Go to **Tenants** to view organizations.
2.  **Add Tenant**: Enter a name, suboptimal (URL), and branding details (logo, colors).
3.  **Status**: Set to `Active` or `Suspended`.

## System Settings

Configure global parameters in **Settings**.
- **Branding**: Upload a default logo and set primary colors.
- **Integrations**: Connect payment gateways (Stripe) and email providers (Resend).
- **Security**: Enable/disable registrations, reset user passwords.

## Support & Moderation

- **Reports**: View flagged content or user reports.
- **Content Moderation**: Review pending courses before publication.
