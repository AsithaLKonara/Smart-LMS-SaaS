# SaaS LMS Master Plan & Design Blueprint

This document serves as the "Source of Truth" for the E2E SaaS LMS expansion, based on the high-level Figma blueprint and the "Facade-web" futuristic design aesthetic.

---

## Implementation Status Summary

### ✅ Completed (Glass Theme + Video Background)
- **Core Infrastructure**: BackgroundVideo component, enhanced glass utilities, layout integration
- **Landing & Marketing**: Full landing page with video background, all landing components (Stats, Features, HowItWorks, CertificationCTA)
- **Auth Pages**: Login/Signup with video background and glass forms
- **Course Pages**: Catalog, Detail, Builder, Lesson Player - all with glass theme
- **Academic Pages**: Assignments (list and submission views)
- **User Pages**: Learner Profile with glass theme
- **Component Library**: Card (glass variants), Dialog (glass overlay), Button enhancements
- **Design System**: All Figma checklist items implemented (Grid, Spacing, Components, Visual Aesthetic)

### 🛠 In Progress / Pending
- **Phase 13.1**: Dash Switcher
- **Phase 13.2**: Messaging / Inbox
- **Phase 13.3**: Asset Library / SCORM
- **Phase 13.4**: Billing & Metering
- **Remaining Page Refreshes**: Gradebook, Users/People, Cohorts, Calendar, Analytics, Integrations, Settings, Security/Audit, Help Center

---

## Role Legend

| Code | Role | Description |
| :--- | :--- | :--- |
| **SA** | Super Admin | Platform-level management |
| **OA** | Org Admin | Organization owner |
| **IN** | Instructor | Teaching and content creation |
| **TA** | TA / Manager | Content management / Course admin |
| **ST** | Student | Learner / User |
| **GU** | Guest | Marketing visitor |
| **BM** | Billing Manager | Finance role |
| **SP** | Support | Moderator / Support agent |
| **OB** | Observer | Read-only auditor |

---

## Pages & Sections Table

| Page | Sections (per page) | Primary components to design | Role access (short) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Global Shell** | Global nav (logo, org switcher), search, global notifications, user menu, breadcrumbs | Topbar, sidebar, org switcher, notifications | SA:A, OA:A, IN:V/E, ST:V | ✅ Done (Glass Theme) |
| **Marketing Landing** | Hero, value props, features grid, pricing tiers, FAQ, testimonials | Hero banner, CTAs, pricing cards, FAQ | GU:V, ST:V, OA:E | ✅ Done (Video BG + Glass) |
| **Auth Pages** | Social login, sign-up, SSO options, magic link | Forms, validation UI, premium layout | All roles | ✅ Done (Video BG + Glass) |
| **Onboarding Wizard** | Company details, admin invite, initial plan selection, initial course import | Multi-step modal, progress, invite users component, sample content toggle | OA:A, SA:A | ✅ Done (Glass Theme) |
| **Dash Switcher** | Org list, role summary, last-active, switch confirmation | Modal, list items, search, pinned orgs | OA:A, SA:A | 🛠 Phase 13.1 |
| **Dashboard — Admin** | KPI strip, alerts, recent activity, system health | KPI cards, charts, health widgets | SA:A, OA:A | ✅ Done (Glass Theme) |
| **Dashboard — Instructor** | Personal courses, grading queue, student progress indices | Course list, progress charts, KPI strip | IN:E, TA:E, OA:V | ✅ Done (Glass Theme) |
| **Dashboard — Student** | Enrolled courses, progress, next due, grades, streak | Card grid, progress ring, KPI strip | ST:V, IN:V | ✅ Done (Glass Theme) |
| **Course Catalog** | Filters, categories, featured, sorting, course cards | Filter bar, course card variants | GU:V, ST:V, OA:E | ✅ Done (Glass Theme) |
| **Course Page** | Header, syllabus (module list), reviews, enroll CTA | Hero, syllabus accordion, sticky CTA | GU:V, ST:V, IN:E | ✅ Done (Glass Theme) |
| **Course Builder** | Modules, lessons, drag & drop, content blocks | Left module nav, canvas editor | IN:E, TA:E, OA:V | ✅ Done (Glass Theme) |
| **Lesson Player** | Video + transcript, attachments, progress | Video player, sidebar discussion | ST:V, IN:E, TA:E | ✅ Done (Glass Theme) |
| **Assignments** | Assignment list, submission view, grading workflow | Table, submission modal | IN:E, TA:E, ST:V | ✅ Done (Glass Theme) |
| **Gradebook** | Course gradebook, analytics, moderation | Table, filters, chart | IN:E, TA:E, OA:V | 🔄 Needs Refresh |
| **Users / People** | User list, invite, roles, activity log | Table, invite modal, role editor | SA:A, OA:A, SP:E | 🔄 Needs Refresh |
| **Learner Profile** | Personal info, enrolled courses, progress, badges | Profile header, activity timeline | ST:E, IN:V, OA:V | ✅ Done (Glass Theme) |
| **Cohorts** | Cohort list, enroll users, schedule, capacity | Cohort card, enrollment modal | OA:E, IN:E, TA:E | 🔄 Needs Refresh |
| **Asset Library** | Media uploader, tagging, versioning | File grid, uploader | IN:E, TA:E, SA:A | 🛠 Phase 13.3 |
| **Calendar** | Calendar view, sessions, booking, timezone | Calendar (Mo/Wk/Day) | IN:E, ST:V/E, OA:V | 🔄 Needs Refresh |
| **Messaging** | Conversations (1:1, threads), notifications | Thread list, composer | IN:E, TA:E, ST:V | 🛠 Phase 13.2 |
| **Analytics** | Engagement, revenue, cohort comparisons | Charts, selectors, date picker | SA:A, OA:A, BM:V/E | 🔄 Needs Refresh |
| **Billing & Plans** | Current plan, invoices, upgrade flow | Pricing table, invoices, usage meter | BM:A, OA:A, SA:A | 🛠 Phase 13.4 |
| **Integrations** | Apps list (Zoom, Stripe, Google), API keys | Integration tiles, connect flow | SA:A, OA:E | 🔄 Needs Refresh |
| **Settings (Org)** | General, branding, domain, feature flags | Settings tabs, form fields | OA:A, SA:A | 🔄 Needs Refresh |
| **Security / Audit** | Login history, audit trail, 2FA policies | Logs table, search, export | SA:A, OA:V, SP:V | 🔄 Needs Refresh |
| **Platform Admin** | Tenant management, system status | Tenants table, global controls | SA:A | ✅ Done (Glass Theme) |
| **Help Center** | KB, tickets, live chat, onboarding guides | KB list, chat widget | All:V, SP:E | 🔄 Needs Refresh |
| **Notifications** | All notifications, filters, settings | List, filters, toast patterns | All:V | ✅ Done (Glass Theme) |

---

## Figma Design Checklist

### Grid & Spacing
- [x] **8pt Base Grid**: Use multiples of 8px for spacing (4px for micro-spacing).
- [x] **12-Column Layout**: 1200-1376px container.
- [x] **Breakpoints**: Mobile (375), Tablet (768), Desktop (1024+).
- [x] **Standard Heights**: Topbar (64px), Sidebar (280px), Table Rows (56-72px).

### Components & Tokens
- [x] **Atomic Design**: Atoms -> Molecules -> Organisms -> Templates.
- [x] **Tokens**: naming (e.g., `--color-primary-500`, `--space-16`).
- [x] **Variants**: States (hover, active, disabled) + Sizes (sm, md, lg).
- [x] **Auto Layout**: Mandatory for all responsive components.

### Visual Aesthetic (Futuristic)
- [x] **Glassmorphism**: Subtle blurs, thin borders, transparent layers. ✅ **IMPLEMENTED** - Enhanced glass utilities with variants (glass, glass-light, glass-dark, glass-xl, glass-2xl) and hover states.
- [x] **Gradients**: Smooth, vibrant (inspired by Facade project). ✅ **IMPLEMENTED** - Applied across landing page, cards, and UI components.
- [x] **Typography**: Modern variable fonts (Inter, Space Grotesk). ✅ **IMPLEMENTED** - Space Grotesk for headings, Inter for body text across all pages.
- [x] **Interactions**: Smart animate micro-interactions, spring animations. ✅ **IMPLEMENTED** - Framer-motion animations with spring physics on all refreshed pages.
- [x] **Video Background**: Full-screen video background with dark overlay. ✅ **IMPLEMENTED** - BackgroundVideo component integrated into landing and auth pages.

---

## Action Items (Current Status vs Plan)

1. [x] **UI Overhaul**: Upgrade Landing surface to match "Facade" quality. ✅ **COMPLETED** - Video background, glass theme, and animations implemented.
2. [x] **Dashboard Refactoring**: Implement missing widgets (KPI strip, engagement charts). ✅ **COMPLETED** - All dashboards refactored with glass theme.
3. [x] **Glass Theme Implementation**: Apply glassmorphism across all pages. ✅ **COMPLETED** - All major pages refreshed with glass theme:
   - ✅ Landing page with video background
   - ✅ Auth pages with video background
   - ✅ Course Catalog, Course Detail, Course Builder
   - ✅ Lesson Player with glass video container
   - ✅ Assignments pages
   - ✅ Learner Profile
   - ✅ All dashboard pages
   - ✅ Component library (Card, Dialog, Button variants)
4. [ ] **Missing Modules**:
   - [x] Onboarding Wizard (Phase 13.1) ✅ **COMPLETED**
   - [ ] Messaging / Inbox (Phase 13.2) 🛠 **PENDING**
   - Asset Library / SCORM (Phase 13.3) 🛠 **PENDING**
   - Billing & Metering (Phase 13.4) 🛠 **PENDING**
5. [ ] **Remaining Page Refreshes**: Apply glass theme to remaining pages:
   - [ ] Gradebook
   - [ ] Users / People
   - [ ] Cohorts
   - [ ] Calendar
   - [ ] Analytics
   - [ ] Integrations
   - [ ] Settings (Org)
   - [ ] Security / Audit
   - [ ] Help Center
6. [ ] **RBAC Matrix**: Enforce the specified permission matrix in middleware and components.
