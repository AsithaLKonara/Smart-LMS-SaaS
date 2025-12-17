# Phase 2.1: Design System Configuration - Detailed Implementation Plan

**Objective:** Configure Tailwind CSS with complete dark theme, typography system, animation utilities, and glassmorphism effects.

---

## Step 1: Update Tailwind Configuration

### 1.1 Extend Theme with Custom Colors
- **Location:** `tailwind.config.ts`
- **Dark Theme Colors:**
  - Primary background: `#0B0F1A` (deep space blue)
  - Secondary panels: `#111827`
  - Card background: `rgba(255,255,255,0.03)`
  - Primary accent: `#22D3EE` (Neon Cyan)
  - Secondary accent: `#A855F7` (Electric Purple)
  - Text colors (primary, secondary, muted)
  - Border colors
  - Error, warning, success colors

### 1.2 Configure Typography
- **Font Families:**
  - Headings: `['Space Grotesk', 'Inter', 'sans-serif']`
  - Body: `['Inter', 'sans-serif']`
  - Monospace: `['Fira Code', 'monospace']`
- **Font Sizes:**
  - H1: 40px (desktop), 28-32px (mobile)
  - H2: 24px
  - Body: 16px
  - Caption: 12px
- **Line Heights:**
  - Body: 1.6 (important for study content)
  - Headings: 1.2

### 1.3 Configure Spacing & Border Radius
- **Custom Spacing:** Extended scale for consistent spacing
- **Border Radius:**
  - Cards: 16-24px
  - Buttons: 8-12px
  - Inputs: 8px

### 1.4 Configure Shadows
- **Card Shadow:** `0 10px 30px rgba(0,0,0,0.4)`
- **Hover Shadow:** Enhanced shadow for hover states
- **Glow Effects:** For neon accents

**Files Modified:**
- `tailwind.config.ts`

---

## Step 2: Set Up Typography System

### 2.1 Import Google Fonts
- **Location:** `app/layout.tsx`
- **Fonts to Import:**
  - Inter (weights: 400, 500, 600, 700)
  - Space Grotesk (weights: 400, 500, 600, 700)
- **Method:** Use `next/font/google`

### 2.2 Configure Font Variables
- **Location:** `app/globals.css`
- **CSS Variables:**
  - `--font-inter`
  - `--font-space-grotesk`
  - Apply to Tailwind config

**Files Modified:**
- `app/layout.tsx`
- `app/globals.css`
- `tailwind.config.ts`

---

## Step 3: Create Animation Utilities

### 3.1 Define Custom Animations
- **Location:** `tailwind.config.ts`
- **Animations:**
  - `fade-in`: 150ms ease-out
  - `fade-out`: 150ms ease-out
  - `slide-up`: 200ms ease-out
  - `slide-down`: 200ms ease-out
  - `scale-in`: 200ms ease-out
  - `hover-lift`: Subtle translateY on hover
  - `pulse-glow`: For neon accents

### 3.2 Create Animation Utilities
- **Location:** `app/globals.css`
- **Keyframes:**
  - Define all animation keyframes
  - Use ease-out timing function
  - Duration: 150-300ms

**Files Modified:**
- `tailwind.config.ts`
- `app/globals.css`

---

## Step 4: Configure Glassmorphism Utilities

### 4.1 Create Glassmorphism Classes
- **Location:** `app/globals.css`
- **Classes:**
  - `.glass`: Base glassmorphism effect
  - `.glass-light`: Lighter glass effect
  - `.glass-dark`: Darker glass effect
  - Properties:
    - Background: `rgba(255,255,255,0.03)`
    - Backdrop blur: `blur(10px)`
    - Border: `1px solid rgba(255,255,255,0.1)`

### 4.2 Create Glassmorphism Variants
- Different opacity levels
- Different blur amounts
- Border variations

**Files Modified:**
- `app/globals.css`

---

## Step 5: Set Up Dark Theme Base Styles

### 5.1 Configure Base Colors
- **Location:** `app/globals.css`
- **Root Variables:**
  - Background colors
  - Text colors
  - Accent colors
  - Border colors

### 5.2 Set Default Background
- **Body Background:** `#0B0F1A`
- **Text Color:** Light gray/white
- **Smooth Transitions:** For theme switching (future)

**Files Modified:**
- `app/globals.css`

---

## Step 6: Create Custom Utility Classes

### 6.1 Card Utilities
- **Location:** `app/globals.css`
- **Classes:**
  - `.card-3d`: 3D depth effect
  - `.card-hover`: Hover lift effect
  - `.card-glow`: Neon glow effect

### 6.2 Text Utilities
- **Classes:**
  - `.text-gradient`: Gradient text effect
  - `.text-neon`: Neon glow text
  - `.text-balance`: Better text wrapping

### 6.3 Layout Utilities
- **Classes:**
  - `.container-padding`: Consistent padding
  - `.section-spacing`: Section spacing

**Files Modified:**
- `app/globals.css`

---

## Step 7: Configure Responsive Breakpoints

### 7.1 Update Breakpoints
- **Location:** `tailwind.config.ts`
- **Breakpoints:**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

### 7.2 Mobile-First Approach
- Ensure all styles are mobile-first
- Desktop styles as overrides

**Files Modified:**
- `tailwind.config.ts`

---

## Step 8: Create Color Palette System

### 8.1 Define Color Scale
- **Location:** `tailwind.config.ts`
- **For Each Color:**
  - 50-950 scale
  - Semantic names (primary, secondary, accent)
  - Dark theme optimized

### 8.2 Create Semantic Color Tokens
- **Colors:**
  - `bg-primary` → `#0B0F1A`
  - `bg-secondary` → `#111827`
  - `bg-card` → `rgba(255,255,255,0.03)`
  - `accent-cyan` → `#22D3EE`
  - `accent-purple` → `#A855F7`

**Files Modified:**
- `tailwind.config.ts`

---

## Step 9: Configure Scrollbar Styling

### 9.1 Custom Scrollbar
- **Location:** `app/globals.css`
- **Styling:**
  - Dark theme colors
  - Thin, modern scrollbar
  - Smooth scrolling
  - Webkit and Firefox support

**Files Modified:**
- `app/globals.css`

---

## Step 10: Create Design Tokens File

### 10.1 Create Design Tokens
- **Location:** `constants/design-tokens.ts`
- **Purpose:** Centralized design values
- **Tokens:**
  - Colors
  - Spacing
  - Typography
  - Shadows
  - Animations
  - Breakpoints

**Files Created:**
- `constants/design-tokens.ts`

---

## Step 11: Create Theme Provider

### 11.1 Create Theme Context
- **Location:** `components/providers/ThemeProvider.tsx`
- **Purpose:** Theme management (for future light mode)
- **Features:**
  - Theme state
  - Theme toggle (future)
  - CSS variable updates

**Files Created:**
- `components/providers/ThemeProvider.tsx`

---

## Step 12: Test Design System

### 12.1 Visual Testing
- Create test page with all design elements
- Verify colors render correctly
- Verify typography scales
- Verify animations work
- Verify glassmorphism effects

### 12.2 Responsive Testing
- Test on mobile devices
- Test on tablets
- Test on desktop
- Verify breakpoints work

---

## Deliverables Checklist

- [ ] Tailwind configured with dark theme colors
- [ ] Typography system set up (Inter + Space Grotesk)
- [ ] Animation utilities created (150-300ms ease-out)
- [ ] Glassmorphism utilities configured
- [ ] Custom utility classes created
- [ ] Color palette system defined
- [ ] Responsive breakpoints configured
- [ ] Scrollbar styling applied
- [ ] Design tokens file created
- [ ] Theme provider created
- [ ] All styles tested and working

---

## File Structure Summary

### Created Files:
- `constants/design-tokens.ts`
- `components/providers/ThemeProvider.tsx`

### Modified Files:
- `tailwind.config.ts` (complete theme configuration)
- `app/globals.css` (all custom styles)
- `app/layout.tsx` (font imports)

---

## Next Steps

After completing Phase 2.1, proceed to:
- **Phase 2.2**: Core UI Components

---

## Notes

- Never use pure black (#000000) - causes eye strain
- Maintain consistent spacing scale
- All animations should be purposeful (explain, not entertain)
- Test accessibility (contrast ratios)
- Keep performance in mind (no heavy animations)
- Mobile-first approach for all styles

