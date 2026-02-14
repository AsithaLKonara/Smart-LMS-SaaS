# Phase 10.1: Settings & Profile Implementation Plan

## Objective
Allow users to manage their account details, preferences, and notifications.

## 1. Profile Management (✅ Implemented)
- [x] **Page**: `app/(dashboard)/profile/page.tsx` (Shared for all roles).
- [x] **Features**:
  - Update Name (Server Action + Form).
  - Avatar Preview (Upload placeholder).
  - Security/Preferences widgets.

## 2. Platform Settings (❌ To Do)
- [ ] **Theme**: Toggle (if we support Light/Dark).
- [ ] **Notifications**: Toggle email preferences.

## File Structure
```
app/(dashboard)/(student)/profile/page.tsx
components/features/settings/
  ProfileForm.tsx
  SecuritySettings.tsx
```
