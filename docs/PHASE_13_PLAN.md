# Phase 13 Plan: SaaS LMS Design Overhaul & Feature Gap Expansion

## Objective
Elevate the platform's UI to a "perfect futuristic design" inspired by the Facade project, and start implementing the high-level SaaS blueprint.

## 1. Design System Refresh
- [x] Update `tailwind.config.ts` / `globals.css` with new tokens (OKLCH support if needed, premium gradients).
- [x] Overhaul `components/ui` (Button, Card, Input) with glassmorphism and modern shadows.
- [x] Implement a `TextGradient` component for standardized "SaaS headings".

## 2. Marketing Landing Refinement
- [x] Replace current basic hero with a rich, animated "Facade-style" Hero.
- [ ] Add "Features Grid" and "Pricing Tiers" components.
- [ ] Implement "Testimonials" and "FAQ" sections.

## 3. Dashboard Infrastructure
- [x] Create a `GlobalShell` layout (sidebar + topbar with org switcher).
- [x] Implement the `OrgSwitcher` component for multi-tenancy.
- [x] Design the `KPIStrip` and `EngagementCharts` widgets for the Admin Dashboard.
- [x] **Onboarding Wizard (13.1)**: Multi-step setup for new organizations.

## 4. Messaging & Notifications
- [ ] Implement `MessagingCenter` for 1:1 and course threads.
- [ ] Expand `NotificationCenter` with filters and "Mark as Read" functionality.

## 5. Billing & Settings
- [ ] Implement `BillingManager` view (Invoices, Usage metering).
- [ ] Update `Settings` page with branding controls (Logo upload, custom domain).

---

## Technical Considerations
- **Animations**: Use `framer-motion` or Tailwind `animate-in` for smooth transitions.
- **Data Layers**: Ensure all new sections are backed by Prisma models (Role-based).
- **Responsiveness**: Strictly follow the 12-column grid and 8pt spacing system.

## Next Steps
1. Refine `globals.css` with Facade-inspired variables.
2. Update the landing page hero.
3. Audit `app/(dashboard)` for role-based layout consistency.
