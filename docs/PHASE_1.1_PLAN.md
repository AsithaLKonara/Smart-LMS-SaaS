# Phase 1.1: Project Initialization - Detailed Implementation Plan

**Objective:** Set up the Next.js 14+ project foundation with TypeScript, Tailwind CSS, code quality tools, and proper folder structure.

---

## Step 1: Initialize Next.js 14+ Project with TypeScript

### 1.1 Create Next.js Project
- **Command:** `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
- **Options:**
  - Use TypeScript: Yes
  - Use ESLint: Yes
  - Use Tailwind CSS: Yes
  - Use App Router: Yes (default in Next.js 14+)
  - Customize import alias: `@/*`
  - No `src/` directory (root-level structure)

### 1.2 Verify Installation
- Check `package.json` for Next.js 14+ version
- Verify TypeScript configuration exists
- Confirm Tailwind CSS is installed

**Files Created:**
- `package.json`
- `tsconfig.json`
- `next.config.js` (or `.mjs`)
- `tailwind.config.ts`
- `postcss.config.js`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`

---

## Step 2: Configure Tailwind CSS with Custom Dark Theme

### 2.1 Update `tailwind.config.ts`
- **Location:** `tailwind.config.ts`
- **Changes:**
  - Extend theme with custom colors:
    - Primary background: `#0B0F1A` (deep space blue)
    - Secondary panels: `#111827`
    - Card background: `rgba(255,255,255,0.03)`
    - Primary accent: `#22D3EE` (Neon Cyan)
    - Secondary accent: `#A855F7` (Electric Purple)
  - Configure font families:
    - Headings: `['Space Grotesk', 'Inter', 'sans-serif']`
    - Body: `['Inter', 'sans-serif']`
  - Add custom spacing, border radius, shadows
  - Configure animation utilities (150-300ms ease-out)

### 2.2 Update `app/globals.css`
- **Location:** `app/globals.css`
- **Changes:**
  - Import Inter and Space Grotesk fonts from Google Fonts
  - Set base dark theme colors
  - Configure default background color
  - Set line height to 1.6 for body text
  - Add glassmorphism utility classes
  - Configure scrollbar styling for dark theme

**Files Modified:**
- `tailwind.config.ts`
- `app/globals.css`

---

## Step 3: Set Up ESLint and Prettier

### 3.1 Configure ESLint
- **Location:** `.eslintrc.json` (or `.eslintrc.js`)
- **Configuration:**
  - Extend Next.js recommended rules
  - Add TypeScript-specific rules
  - Configure import/export rules
  - Set up accessibility rules (eslint-plugin-jsx-a11y)

### 3.2 Configure Prettier
- **Location:** `.prettierrc` and `.prettierignore`
- **Configuration:**
  - Single quotes
  - Trailing commas
  - Tab width: 2
  - Semicolons: true
  - Print width: 100
  - Arrow parens: always

### 3.3 Add Scripts to `package.json`
- Add scripts:
  - `"lint": "next lint"`
  - `"lint:fix": "next lint --fix"`
  - `"format": "prettier --write ."`
  - `"format:check": "prettier --check ."`

**Files Created:**
- `.eslintrc.json`
- `.prettierrc`
- `.prettierignore`

**Files Modified:**
- `package.json`

---

## Step 4: Create Project Folder Structure

### 4.1 Create Directory Structure
Create the following folder structure:

```
app/
  (auth)/
    login/
      page.tsx
    register/
      page.tsx
    forgot-password/
      page.tsx
  (dashboard)/
    (student)/
      dashboard/
        page.tsx
      courses/
        page.tsx
      courses/[id]/
        page.tsx
      live/
        page.tsx
      ai-chat/
        page.tsx
      profile/
        page.tsx
    (instructor)/
      dashboard/
        page.tsx
      courses/
        page.tsx
      courses/[id]/
        page.tsx
      students/
        page.tsx
    (admin)/
      dashboard/
        page.tsx
      tenants/
        page.tsx
      users/
        page.tsx
  (landing)/
    page.tsx
    layout.tsx
  api/
    auth/
      [...nextauth]/
        route.ts
    courses/
      route.ts
    lessons/
      route.ts
    exams/
      route.ts
    live-classes/
      route.ts
    ai/
      chat/
        route.ts
    analytics/
      route.ts
    tenants/
      route.ts
    users/
      route.ts
  layout.tsx
  page.tsx
  globals.css
  not-found.tsx
  error.tsx
  loading.tsx

components/
  ui/
    Button.tsx
    Card.tsx
    Input.tsx
    Modal.tsx
    Toast.tsx
    Badge.tsx
    ProgressRing.tsx
    Skeleton.tsx
  layout/
    Header.tsx
    Footer.tsx
    Sidebar.tsx
    BottomNav.tsx
    Container.tsx
  features/
    CourseCard.tsx
    LessonPlayer.tsx
    AIChat.tsx
    ExamTimer.tsx
    LiveClassCard.tsx
  providers/
    ThemeProvider.tsx
    TenantProvider.tsx
    ToastProvider.tsx

lib/
  db/
    prisma.ts
    queries/
      courses.ts
      users.ts
      enrollments.ts
  auth/
    config.ts
    middleware.ts
    permissions.ts
  ai/
    openai.ts
    prompts.ts
  utils/
    cn.ts
    format.ts
    validation.ts
    constants.ts

types/
  index.ts
  auth.ts
  course.ts
  user.ts
  tenant.ts
  api.ts

prisma/
  schema.prisma
  migrations/

public/
  images/
  icons/
  fonts/

hooks/
  useAuth.ts
  useTenant.ts
  useCourse.ts
  useAI.ts
  useMediaQuery.ts

constants/
  routes.ts
  permissions.ts
  plans.ts
```

### 4.2 Create Initial Files

#### 4.2.1 Core App Files
- **`app/layout.tsx`**: Root layout with metadata, font loading, providers
- **`app/page.tsx`**: Landing page (temporary, will be moved to `(landing)/page.tsx`)
- **`app/not-found.tsx`**: 404 page
- **`app/error.tsx`**: Error boundary
- **`app/loading.tsx`**: Global loading component

#### 4.2.2 Utility Files
- **`lib/utils/cn.ts`**: Class name utility (clsx + tailwind-merge)
- **`lib/utils/constants.ts`**: App-wide constants
- **`types/index.ts`**: Central type exports

#### 4.2.3 Configuration Files
- **`constants/routes.ts`**: Route constants
- **`constants/permissions.ts`**: Permission constants
- **`constants/plans.ts`**: Subscription plan constants

**Files Created:**
- All directory structure above
- Initial placeholder files for key components
- Type definitions
- Utility functions

---

## Step 5: Install Additional Dependencies

### 5.1 Core Dependencies
```bash
npm install clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-toast
npm install class-variance-authority
npm install zod  # For validation
npm install date-fns  # For date formatting
```

### 5.2 Development Dependencies
```bash
npm install -D @types/node
npm install -D prettier eslint-config-prettier
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**Files Modified:**
- `package.json`

---

## Step 6: Create Initial Configuration Files

### 6.1 TypeScript Configuration
- **Location:** `tsconfig.json`
- **Enhancements:**
  - Add path aliases for `@/*`
  - Configure strict mode
  - Add include/exclude patterns

### 6.2 Next.js Configuration
- **Location:** `next.config.js` (or `.mjs`)
- **Enhancements:**
  - Configure image domains (for external images)
  - Set up environment variable validation
  - Configure redirects/rewrites if needed

### 6.3 Environment Variables Template
- **Location:** `.env.example`
- **Variables:**
  ```
  DATABASE_URL=
  NEXTAUTH_SECRET=
  NEXTAUTH_URL=
  OPENAI_API_KEY=
  ```

**Files Created:**
- `.env.example`

**Files Modified:**
- `tsconfig.json`
- `next.config.js`

---

## Step 7: Create Base Components

### 7.1 Utility Components
- **`components/ui/Button.tsx`**: Base button component with variants
- **`components/ui/Card.tsx`**: Base card component with 3D depth
- **`components/ui/Input.tsx`**: Base input component
- **`lib/utils/cn.ts`**: Class name utility function

### 7.2 Layout Components (Placeholders)
- **`components/layout/Container.tsx`**: Page container wrapper
- **`components/layout/Header.tsx`**: Header component (placeholder)
- **`components/layout/Footer.tsx`**: Footer component (placeholder)

**Files Created:**
- Base UI components (minimal implementation)
- Layout components (placeholders)

---

## Step 8: Set Up Git Hooks (Optional but Recommended)

### 8.1 Husky Setup
```bash
npm install -D husky lint-staged
npx husky init
```

### 8.2 Configure Pre-commit Hook
- **Location:** `.husky/pre-commit`
- **Content:** Run lint-staged

### 8.3 Configure lint-staged
- **Location:** `package.json`
- **Configuration:** Run ESLint and Prettier on staged files

**Files Created:**
- `.husky/pre-commit`

**Files Modified:**
- `package.json`

---

## Step 9: Create README with Setup Instructions

### 9.1 Update README.md
- **Location:** `README.md`
- **Content:**
  - Project overview
  - Tech stack
  - Prerequisites
  - Installation steps
  - Development commands
  - Project structure
  - Environment variables setup

**Files Modified:**
- `README.md`

---

## Step 10: Verify Setup

### 10.1 Run Development Server
- **Command:** `npm run dev`
- **Verify:**
  - Server starts without errors
  - TypeScript compiles successfully
  - Tailwind CSS works
  - No ESLint errors

### 10.2 Run Linting and Formatting
- **Commands:**
  - `npm run lint`
  - `npm run format:check`
- **Verify:** No errors

### 10.3 Build Test
- **Command:** `npm run build`
- **Verify:** Production build succeeds

---

## Deliverables Checklist

- [ ] Next.js 14+ project initialized with TypeScript
- [ ] Tailwind CSS configured with dark theme colors
- [ ] ESLint and Prettier configured and working
- [ ] Complete folder structure created
- [ ] Base utility functions created (`cn.ts`, constants)
- [ ] Base UI components created (Button, Card, Input)
- [ ] TypeScript configuration optimized
- [ ] Environment variables template created
- [ ] README with setup instructions
- [ ] Development server runs successfully
- [ ] Linting and formatting work correctly
- [ ] Production build succeeds

---

## File Structure Summary

### Created Files:
- `package.json` (updated)
- `tsconfig.json` (updated)
- `tailwind.config.ts` (updated)
- `next.config.js` (updated)
- `.eslintrc.json`
- `.prettierrc`
- `.prettierignore`
- `.env.example`
- `README.md` (updated)
- `app/layout.tsx` (updated)
- `app/page.tsx` (updated)
- `app/globals.css` (updated)
- `app/not-found.tsx`
- `app/error.tsx`
- `app/loading.tsx`
- `lib/utils/cn.ts`
- `lib/utils/constants.ts`
- `types/index.ts`
- `constants/routes.ts`
- `constants/permissions.ts`
- `constants/plans.ts`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/Input.tsx`
- `components/layout/Container.tsx`
- `components/layout/Header.tsx` (placeholder)
- `components/layout/Footer.tsx` (placeholder)

### Created Directories:
- `app/(auth)/`
- `app/(dashboard)/`
- `app/(landing)/`
- `app/api/`
- `components/ui/`
- `components/layout/`
- `components/features/`
- `components/providers/`
- `lib/db/`
- `lib/auth/`
- `lib/ai/`
- `lib/utils/`
- `types/`
- `prisma/`
- `hooks/`
- `constants/`

---

## Next Steps

After completing Phase 1.1, proceed to:
- **Phase 1.2**: Database Setup (Prisma + PostgreSQL)
- **Phase 1.3**: Authentication Foundation (NextAuth.js)

---

## Notes

- All code should follow TypeScript strict mode
- Use functional components with TypeScript
- Follow Next.js 14+ App Router conventions
- Maintain consistent code style with Prettier
- All components should be mobile-first responsive
- Use semantic HTML for accessibility

