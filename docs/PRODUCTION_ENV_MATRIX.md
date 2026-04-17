# Production Environment Matrix

## Environments

| Environment | Purpose | Hosting | DB | Branch |
| :--- | :--- | :--- | :--- | :--- |
| Local | Developer iteration | Local Next.js | Local Postgres / dev managed DB | feature branches |
| Preview | PR validation and stakeholder QA | Vercel Preview | Managed Postgres (preview schema/db) | pull requests |
| Production | Live tenant traffic | Vercel Production | Managed Postgres (prod) | main |

## Required Variables by Environment

- App/Auth: `NEXT_PUBLIC_APP_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Data: `DATABASE_URL`
- Messaging/Email: `RESEND_API_KEY`, `EMAIL_FROM`
- AI: `OPENAI_API_KEY`
- Assets: `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`
- Billing: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Observability: `SENTRY_DSN` (optional but recommended)

## Secret Rotation Policy

- Rotate critical secrets every 90 days:
  - `NEXTAUTH_SECRET`
  - `DATABASE_URL` credentials
  - payment and webhook keys
- Rotate immediately after suspected compromise.
- Validate key health in preview before production promotion.

## Backup and Retention

- Managed Postgres:
  - PITR enabled
  - Daily backup snapshots
  - Minimum retention: 14 days
- Monthly restore drill to non-production environment.
