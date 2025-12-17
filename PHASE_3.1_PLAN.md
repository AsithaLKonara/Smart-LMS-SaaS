# Phase 3.1: Landing Page - Detailed Implementation Plan

**Objective:** Create a stunning landing page with dark 3D futuristic design, featuring hero section, features, pricing, and social proof sections.

---

## Step 1: Create Landing Page Route Group

### 1.1 Set Up Route Structure
- **Location:** `app/(landing)/page.tsx`
- **Purpose:** Main landing page
- Move existing `app/page.tsx` to `app/(landing)/page.tsx`

### 1.2 Create Landing Layout
- **Location:** `app/(landing)/layout.tsx`
- **Purpose:** Landing-specific layout (no auth required)
- Features: Full-width layout, no sidebar

**Files Created:**
- `app/(landing)/page.tsx`
- `app/(landing)/layout.tsx`

---

## Step 2: Header/Navigation Component

### 2.1 Create Header Component
- **Location:** `components/layout/Header.tsx`
- **Features:**
  - Sticky navigation (transparent → solid on scroll)
  - Logo on left
  - Menu items: Features | AI Learning | Pricing | For Schools | Login
  - Primary CTA: "Start Free" (neon accent)
  - Mobile hamburger menu
  - Smooth scroll behavior

### 2.2 Header States
- **Transparent:** On top of page
- **Solid:** After scroll (with backdrop blur)
- **Mobile:** Hamburger menu with slide-out drawer

**Files Created:**
- `components/layout/Header.tsx`

---

## Step 3: Hero Section

### 3.1 Create Hero Component
- **Location:** `components/landing/Hero.tsx`
- **Features:**
  - Full viewport height
  - Dark gradient background
  - Floating 3D cards (animated)
  - Headline: "AI-Powered Smart Learning Platform"
  - Subtext: Value proposition
  - CTAs: "Start Free" (primary), "Watch Demo" (secondary)
  - Subtle motion animations

### 3.2 Floating 3D Cards
- **Animation:** Gentle floating motion
- **Design:** Glassmorphism cards
- **Content:** Feature highlights or stats
- **Performance:** CSS animations (not heavy JS)

**Files Created:**
- `components/landing/Hero.tsx`

---

## Step 4: Features Section

### 4.1 Create Features Component
- **Location:** `components/landing/Features.tsx`
- **Layout:** 2-3 column grid (mobile → stacked)
- **Feature Cards:**
  - AI Tutor
  - Live Classes
  - Analytics
  - Certificates
  - Multi-Tenant

### 4.2 Feature Card Design
- Icon + short text
- Hover elevation effect
- Neon accent on hover
- Smooth transitions

**Files Created:**
- `components/landing/Features.tsx`
- `components/landing/FeatureCard.tsx`

---

## Step 5: Pricing Section

### 5.1 Create Pricing Component
- **Location:** `components/landing/Pricing.tsx`
- **Features:**
  - Pricing cards: Free / Pro / Enterprise
  - Pro plan highlighted (neon border)
  - Toggle: Monthly / Yearly
  - Feature comparison
  - CTA buttons per plan

### 5.2 Pricing Card Design
- Glassmorphism style
- Highlighted plan (Pro) with glow
- Feature list
- Price display (with toggle)
- CTA button

**Files Created:**
- `components/landing/Pricing.tsx`
- `components/landing/PricingCard.tsx`

---

## Step 6: Social Proof Section

### 6.1 Create Testimonials Component
- **Location:** `components/landing/Testimonials.tsx`
- **Features:**
  - Customer testimonials
  - Avatar + name + role
  - Quote text
  - Star ratings
  - Carousel/slider (optional)

### 6.2 Create Logos Component
- **Location:** `components/landing/Logos.tsx`
- **Features:**
  - Partner/client logos
  - Grayscale with hover color
  - Smooth transitions

**Files Created:**
- `components/landing/Testimonials.tsx`
- `components/landing/Logos.tsx`

---

## Step 7: Footer Component

### 7.1 Create Footer Component
- **Location:** `components/layout/Footer.tsx`
- **Sections:**
  - Links (Features, Pricing, About, Contact)
  - Social media links
  - Legal links (Privacy, Terms)
  - Copyright notice
  - Newsletter signup (optional)

**Files Created:**
- `components/layout/Footer.tsx`

---

## Step 8: Scroll Animations

### 8.1 Implement Scroll Animations
- **Library:** Framer Motion or CSS animations
- **Features:**
  - Fade in on scroll
  - Slide up animations
  - Stagger animations for lists
  - Performance optimized

### 8.2 Animation Triggers
- Intersection Observer API
- Smooth scroll behavior
- Respect reduced motion preference

**Files Modified:**
- All landing components

---

## Step 9: Mobile Optimization

### 9.1 Responsive Design
- Test on mobile devices
- Optimize touch targets
- Stack sections vertically
- Optimize images
- Lazy load below-fold content

### 9.2 Performance
- Image optimization
- Code splitting
- Lazy loading
- Minimize animations on mobile

---

## Step 10: SEO & Metadata

### 10.1 Add Metadata
- **Location:** `app/(landing)/page.tsx`
- **Metadata:**
  - Title
  - Description
  - Open Graph tags
  - Twitter cards

### 10.2 Structured Data
- Add JSON-LD schema
- Organization schema
- Product schema

**Files Modified:**
- `app/(landing)/page.tsx`

---

## Deliverables Checklist

- [ ] Landing page route group created
- [ ] Header/Navigation component with sticky behavior
- [ ] Hero section with floating 3D cards
- [ ] Features section with feature cards
- [ ] Pricing section with toggle
- [ ] Social proof section (testimonials + logos)
- [ ] Footer component
- [ ] Scroll animations implemented
- [ ] Mobile optimization complete
- [ ] SEO metadata added
- [ ] All sections tested and working

---

## File Structure Summary

### Created Files:
- `app/(landing)/page.tsx`
- `app/(landing)/layout.tsx`
- `components/landing/Hero.tsx`
- `components/landing/Features.tsx`
- `components/landing/FeatureCard.tsx`
- `components/landing/Pricing.tsx`
- `components/landing/PricingCard.tsx`
- `components/landing/Testimonials.tsx`
- `components/landing/Logos.tsx`
- `components/layout/Header.tsx` (updated)
- `components/layout/Footer.tsx`

---

## Next Steps

After completing Phase 3.1, proceed to:
- **Phase 3.2**: Authentication Pages

---

## Notes

- Keep animations subtle and purposeful
- Ensure fast page load (< 2s)
- Test on multiple devices
- Maintain dark theme consistency
- Use semantic HTML for SEO
- Optimize images (WebP format)
- Implement lazy loading

