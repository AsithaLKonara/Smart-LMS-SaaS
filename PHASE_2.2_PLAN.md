# Phase 2.2: Core UI Components - Detailed Implementation Plan

**Objective:** Build all reusable UI components with dark 3D futuristic design, including Card, Button, Input, Navigation, and feedback components.

---

## Step 1: Set Up Component Structure

### 1.1 Create Component Directories
- **Locations:**
  - `components/ui/` - Base UI components
  - `components/layout/` - Layout components
  - `components/features/` - Feature-specific components

### 1.2 Create Component Utilities
- **Location:** `lib/utils/cn.ts`
- **Purpose:** Class name utility (clsx + tailwind-merge)
- **Code:**
  ```typescript
  import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'
  
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```

**Files Created:**
- `lib/utils/cn.ts`

---

## Step 2: Card Component

### 2.1 Create Base Card Component
- **Location:** `components/ui/Card.tsx`
- **Features:**
  - 3D depth with shadows
  - Rounded corners (16-24px)
  - Hover lift effect (translateY)
  - Glassmorphism variant
  - Variants: default, elevated, glass

### 2.2 Card Variants
- **Default:** Standard card with shadow
- **Elevated:** Stronger shadow, more depth
- **Glass:** Glassmorphism effect
- **Interactive:** Hover effects enabled

**Files Created:**
- `components/ui/Card.tsx`

---

## Step 3: Button Component

### 3.1 Create Base Button Component
- **Location:** `components/ui/Button.tsx`
- **Features:**
  - Neon accent variants
  - Press feedback (scale animation)
  - Loading state
  - Disabled state
  - Icon support
  - Sizes: sm, md, lg

### 3.2 Button Variants
- **Primary:** Neon cyan accent
- **Secondary:** Electric purple accent
- **Outline:** Outlined with accent border
- **Ghost:** Transparent background
- **Danger:** Red variant for destructive actions

### 3.3 Button States
- Default
- Hover (glow effect)
- Active (press feedback)
- Disabled
- Loading (spinner)

**Files Created:**
- `components/ui/Button.tsx`

---

## Step 4: Input Component

### 4.1 Create Base Input Component
- **Location:** `components/ui/Input.tsx`
- **Features:**
  - Large touch targets (mobile-first)
  - Inline validation
  - Error state styling
  - Success state styling
  - Label support
  - Helper text
  - Icon support (left/right)

### 4.2 Input Types
- Text
- Email
- Password (with show/hide toggle)
- Number
- Textarea variant

### 4.3 Input States
- Default
- Focus (neon accent border)
- Error (red border + message)
- Success (green border)
- Disabled

**Files Created:**
- `components/ui/Input.tsx`

---

## Step 5: Bottom Navigation Component

### 5.1 Create Bottom Nav Component
- **Location:** `components/layout/BottomNav.tsx`
- **Purpose:** Mobile navigation
- **Features:**
  - Fixed bottom position
  - Thumb-reachable buttons
  - Active state indicator
  - Icon + label
  - Smooth transitions

### 5.2 Navigation Items
- Home
- Courses
- Live
- AI Chat
- Profile

### 5.3 Styling
- Glassmorphism background
- Neon accent for active item
- Smooth icon animations
- Badge support (for notifications)

**Files Created:**
- `components/layout/BottomNav.tsx`

---

## Step 6: Sidebar Component

### 6.1 Create Sidebar Component
- **Location:** `components/layout/Sidebar.tsx`
- **Purpose:** Desktop navigation
- **Features:**
  - Collapsible
  - Active state highlighting
  - Nested menu support
  - User profile section
  - Logout button

### 6.2 Sidebar Sections
- Main navigation
- User section (bottom)
- Collapse/expand toggle

**Files Created:**
- `components/layout/Sidebar.tsx`

---

## Step 7: Skeleton Loaders

### 7.1 Create Skeleton Component
- **Location:** `components/ui/Skeleton.tsx`
- **Purpose:** Loading states
- **Features:**
  - Pulse animation
  - Customizable size
  - Variants: text, circle, rectangle

### 7.2 Skeleton Variants
- **Text:** For text loading
- **Card:** For card loading
- **Avatar:** Circular skeleton
- **List:** For list items

**Files Created:**
- `components/ui/Skeleton.tsx`

---

## Step 8: Progress Rings

### 8.1 Create Progress Ring Component
- **Location:** `components/ui/ProgressRing.tsx`
- **Purpose:** Visual progress indicators
- **Features:**
  - Circular progress ring
  - Percentage display
  - Animated progress
  - Size variants
  - Color variants (cyan, purple)

### 8.2 Progress Ring Variants
- Small (for cards)
- Medium (for dashboards)
- Large (for profile)

**Files Created:**
- `components/ui/ProgressRing.tsx`

---

## Step 9: Badge Component

### 9.1 Create Badge Component
- **Location:** `components/ui/Badge.tsx`
- **Purpose:** Status indicators, achievements
- **Features:**
  - Subtle animations
  - Color variants
  - Size variants
  - Icon support
  - Pulse animation option

### 9.2 Badge Variants
- **Default:** Gray
- **Success:** Green
- **Warning:** Yellow
- **Error:** Red
- **Info:** Cyan
- **Achievement:** Purple with glow

**Files Created:**
- `components/ui/Badge.tsx`

---

## Step 10: Modal/Dialog Component

### 10.1 Create Modal Component
- **Location:** `components/ui/Modal.tsx`
- **Purpose:** Dialogs, confirmations
- **Features:**
  - Glassmorphism style
  - Backdrop blur
  - Close button
  - Keyboard escape
  - Focus trap
  - Animation (fade + scale)

### 10.2 Modal Variants
- **Default:** Standard modal
- **Fullscreen:** Full screen on mobile
- **Centered:** Centered content

**Files Created:**
- `components/ui/Modal.tsx`

---

## Step 11: Toast/Notification Component

### 11.1 Create Toast Component
- **Location:** `components/ui/Toast.tsx`
- **Purpose:** Non-intrusive alerts
- **Features:**
  - Auto-dismiss
  - Manual dismiss
  - Position variants (top-right, bottom-right)
  - Animation (slide in)
  - Icon support
  - Action button support

### 11.2 Toast Variants
- **Success:** Green
- **Error:** Red
- **Warning:** Yellow
- **Info:** Cyan

### 11.3 Toast Provider
- **Location:** `components/providers/ToastProvider.tsx`
- **Purpose:** Global toast management
- **Features:**
  - Toast queue
  - Position management
  - Auto-dismiss timer

**Files Created:**
- `components/ui/Toast.tsx`
- `components/providers/ToastProvider.tsx`

---

## Step 12: Additional UI Components

### 12.1 Avatar Component
- **Location:** `components/ui/Avatar.tsx`
- **Features:**
  - Image support
  - Fallback initials
  - Size variants
  - Status indicator

### 12.2 Dropdown Component
- **Location:** `components/ui/Dropdown.tsx`
- **Features:**
  - Menu items
  - Keyboard navigation
  - Icon support
  - Divider support

### 12.3 Tabs Component
- **Location:** `components/ui/Tabs.tsx`
- **Features:**
  - Tab navigation
  - Active state
  - Content panels
  - Keyboard navigation

### 12.4 Select Component
- **Location:** `components/ui/Select.tsx`
- **Features:**
  - Dropdown select
  - Search support
  - Multi-select option
  - Custom styling

**Files Created:**
- `components/ui/Avatar.tsx`
- `components/ui/Dropdown.tsx`
- `components/ui/Tabs.tsx`
- `components/ui/Select.tsx`

---

## Step 13: Create Component Index

### 13.1 Create Barrel Exports
- **Location:** `components/ui/index.ts`
- **Purpose:** Easy imports
- **Exports:** All UI components

**Files Created:**
- `components/ui/index.ts`
- `components/layout/index.ts`

---

## Step 14: Component Documentation

### 14.1 Add JSDoc Comments
- Document all components
- Document props
- Document usage examples

### 14.2 Create Storybook (Optional)
- Set up Storybook
- Create stories for each component
- Document variants and states

---

## Deliverables Checklist

- [ ] Card component with 3D depth
- [ ] Button component with neon accents
- [ ] Input component with validation states
- [ ] BottomNav component for mobile
- [ ] Sidebar component for desktop
- [ ] Skeleton loaders
- [ ] Progress rings
- [ ] Badge component with animations
- [ ] Modal/Dialog component
- [ ] Toast/Notification component
- [ ] Additional UI components (Avatar, Dropdown, Tabs, Select)
- [ ] Component index exports
- [ ] All components documented

---

## File Structure Summary

### Created Files:
- `components/ui/Card.tsx`
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Skeleton.tsx`
- `components/ui/ProgressRing.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Modal.tsx`
- `components/ui/Toast.tsx`
- `components/ui/Avatar.tsx`
- `components/ui/Dropdown.tsx`
- `components/ui/Tabs.tsx`
- `components/ui/Select.tsx`
- `components/ui/index.ts`
- `components/layout/BottomNav.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/index.ts`
- `components/providers/ToastProvider.tsx`
- `lib/utils/cn.ts`

---

## Next Steps

After completing Phase 2.2, proceed to:
- **Phase 3.1**: Landing Page
- **Phase 3.2**: Authentication Pages

---

## Notes

- All components should be mobile-first
- Use TypeScript for type safety
- Follow accessibility guidelines (ARIA labels, keyboard navigation)
- Test all variants and states
- Keep components small and focused
- Use composition over configuration
- Ensure smooth animations (150-300ms)
- Maintain dark theme consistency

