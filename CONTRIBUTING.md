
# Contributing to Smart LMS SaaS

Thank you for your interest in contributing to Smart LMS SaaS! This document provides guidelines and instructions for setting up your development environment and submitting contributions.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS & Shadcn UI
- **Auth**: NextAuth.js (v5 beta)
- **State**: React Query & Zustand (if applicable)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- PostgreSQL database (local or cloud)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/smart-lms.git
   cd smart-lms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```
   Required variables include `DATABASE_URL`, `NEXTAUTH_SECRET`, `UPLOADTHING_SECRET`, etc.

4. **Database Setup**:
   Push the schema to your local database and seed initial data.
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js App Router pages and API routes.
- `/components` - Reusable UI components.
  - `/ui` - Basic Shadcn UI primitives.
  - `/features` - Complex feature-specific components.
- `/lib` - Utilities, database clients, and helper functions.
- `/prisma` - Database schema and migrations.
- `/public` - Static assets.

## Code Standards

- **TypeScript**: We use strict mode. Avoid `any` types whenever possible.
- **Styling**: Use Tailwind CSS utility classes. Avoid inline styles.
- **Components**: Use functional components with typed props.
- **Linting**: Ensure code passes ESLint and Prettier checks before committing.
  ```bash
  npm run lint
  ```

## Database Changes

If you modify `prisma/schema.prisma`:
1. Run `npx prisma generate` to update the client.
2. Run `npx prisma db push` to update your local DB.
3. Do **not** commit `migrations` unless explicitly instructed (we currently use `db push` for dev).

## Committing

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add new course builder`
- `fix: resolve login redirect issue`
- `docs: update readme`
- `style: fix padding on mobile`
- `refactor: optimize database queries`

## Pull Requests

1. Fork the repository and create a new branch from `main`.
2. Implement your changes.
3. Push to your fork and submit a Pull Request.
4. Ensure all CI checks pass.
5. Provide a clear description of your changes.

## License

This project is proprietary. See LICENSE for details.
