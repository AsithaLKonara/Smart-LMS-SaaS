
# SmartLMS Production Readiness Guide

Follow these steps to successfully deploy the SmartLMS SaaS platform to a live production environment.

## 1. Domain & DNS Configuration
The system relies on wildcard subdomains. You must configure your domain as follows:
*   **A/AAAA Records**: Point `yourdomain.com` to your server/hosting provider.
*   **Wildcard CNAME**: Create a CNAME record for `*.yourdomain.com` pointing to `yourdomain.com`.
*   **SSL**: Ensure you have a **Wildcard SSL Certificate** (e.g., via Let's Encrypt). If using Vercel, this is handled automatically.

## 2. Environment Variables (.env)
Set the following variables in your production hosting provider:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_ROOT_DOMAIN` | The base domain of your platform | `smartlms.space` |
| `NEXTAUTH_URL` | The primary landing page URL | `https://smartlms.space` |
| `AUTH_SECRET` | A unique secret for session encryption | `openssl rand -base64 32` |
| `DATABASE_URL` | Your production PostgreSQL URL | `postgresql://...` |
| `INITIAL_ADMIN_EMAIL` | The first Super Admin email | `admin@smartlms.space` |
| `INITIAL_ADMIN_PASSWORD` | The first Super Admin password | `StrongPassword123!` |

## 3. Database Initialization
Once the environment variables are set, run the following commands in order:

```bash
# 1. Sync the database schema
npx prisma migrate deploy

# 2. Run the production-safe seed script
npx ts-node prisma/prod-seed.ts
```

## 4. Cross-Subdomain Authentication
We have already implemented the logic to share sessions across subdomains. 
**Verification**:
1. Log in at `yourdomain.com/login`.
2. Navigate to `any-tenant.yourdomain.com/dashboard`.
3. You should remain logged in.

## 5. Security Checklist
- [ ] Change `INITIAL_ADMIN_PASSWORD` immediately after the first login.
- [ ] Verify that `NODE_ENV` is set to `production`.
- [ ] Ensure `NEXT_PUBLIC_ROOT_DOMAIN` does NOT include `http://` or `www`.
- [ ] Confirm your database has regular automated backups enabled.
- [ ] Verify that your file storage (e.g., UploadThing/S3) is configured for production.

---

*Prepared by Antigravity AI for SmartLMS Deployment.*
