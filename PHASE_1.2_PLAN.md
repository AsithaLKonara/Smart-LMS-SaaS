# Phase 1.2: Database Setup - Detailed Implementation Plan

**Objective:** Set up Prisma ORM, configure PostgreSQL connection, and design the complete multi-tenant database schema.

---

## Step 1: Install Prisma ORM

### 1.1 Install Prisma
- **Command:** `npm install prisma @prisma/client`
- **Command:** `npm install -D prisma`
- Verify installation in `package.json`

### 1.2 Initialize Prisma
- **Command:** `npx prisma init`
- This creates:
  - `prisma/schema.prisma` - Database schema file
  - `.env` - Environment variables (if not exists)

**Files Created:**
- `prisma/schema.prisma`
- `.env` (if not exists)

---

## Step 2: Configure PostgreSQL Connection

### 2.1 Set Up Database
- Choose PostgreSQL provider:
  - **Development**: Local PostgreSQL or Docker
  - **Production**: Supabase, Neon, AWS RDS, or Railway
- Get connection string

### 2.2 Configure Environment Variables
- **Location:** `.env`
- **Variable:** `DATABASE_URL="postgresql://user:password@localhost:5432/smartlms?schema=public"`
- Update `.env.example` with placeholder

### 2.3 Update Prisma Schema Configuration
- **Location:** `prisma/schema.prisma`
- Configure provider: `provider = "postgresql"`
- Set datasource URL from environment variable

**Files Modified:**
- `prisma/schema.prisma`
- `.env`
- `.env.example`

---

## Step 3: Design Multi-Tenant Database Schema

### 3.1 Core Tenant Schema
- **Location:** `prisma/schema.prisma`
- **Model: Tenant**
  ```prisma
  model Tenant {
    id          String   @id @default(cuid())
    name        String
    subdomain   String   @unique
    logo        String?
    accentColor String?  @default("#22D3EE")
    plan        Plan     @default(FREE)
    status      Status   @default(ACTIVE)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    
    users       User[]
    courses     Course[]
    roles       Role[]
    
    @@index([subdomain])
  }
  
  enum Plan {
    FREE
    PRO
    ENTERPRISE
  }
  
  enum Status {
    ACTIVE
    SUSPENDED
    INACTIVE
  }
  ```

### 3.2 User & Authentication Schema
- **Model: User**
  ```prisma
  model User {
    id        String   @id @default(cuid())
    tenantId  String
    email     String
    name      String
    password  String   // Hashed
    role      RoleType @default(STUDENT)
    avatar    String?
    emailVerified DateTime?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    tenant        Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
    enrollments   Enrollment[]
    lessonProgress LessonProgress[]
    examAttempts  ExamAttempt[]
    submissions   Submission[]
    aiChats       AIChat[]
    notifications Notification[]
    badges        Badge[]
    streak        Streak?
    courses       Course[]        @relation("Instructor")
    
    @@unique([tenantId, email])
    @@index([tenantId])
    @@index([email])
  }
  
  enum RoleType {
    SUPER_ADMIN
    ADMIN
    INSTRUCTOR
    STUDENT
  }
  ```

- **Model: Role** (for custom roles per tenant)
  ```prisma
  model Role {
    id        String   @id @default(cuid())
    tenantId  String
    name      String
    permissions Json   // Array of permission strings
    createdAt DateTime @default(now())
    
    tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
    
    @@unique([tenantId, name])
    @@index([tenantId])
  }
  ```

### 3.3 Course & Learning Schema
- **Model: Course**
  ```prisma
  model Course {
    id          String   @id @default(cuid())
    tenantId    String
    instructorId String
    title       String
    description String?
    thumbnail   String?
    status      CourseStatus @default(DRAFT)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    
    tenant       Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
    instructor   User        @relation("Instructor", fields: [instructorId], references: [id])
    modules      Module[]
    enrollments  Enrollment[]
    exams        Exam[]
    assignments  Assignment[]
    liveClasses  LiveClass[]
    
    @@index([tenantId])
    @@index([instructorId])
  }
  
  enum CourseStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }
  ```

- **Model: Module**
  ```prisma
  model Module {
    id        String   @id @default(cuid())
    courseId  String
    title     String
    order     Int
    createdAt DateTime @default(now())
    
    course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
    lessons  Lesson[]
    
    @@index([courseId])
  }
  ```

- **Model: Lesson**
  ```prisma
  model Lesson {
    id        String   @id @default(cuid())
    moduleId  String
    title     String
    content   String?  // Rich text content
    videoUrl  String?  // YouTube/Vimeo URL
    duration  Int?     // Duration in seconds
    order     Int
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    module         Module          @relation(fields: [moduleId], references: [id], onDelete: Cascade)
    lessonProgress LessonProgress[]
    aiChats        AIChat[]
    
    @@index([moduleId])
  }
  ```

### 3.4 Enrollment & Progress Schema
- **Model: Enrollment**
  ```prisma
  model Enrollment {
    id          String    @id @default(cuid())
    userId      String
    courseId    String
    progress    Float     @default(0) // 0-100
    completedAt DateTime?
    enrolledAt  DateTime  @default(now())
    
    user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)
    course         Course          @relation(fields: [courseId], references: [id], onDelete: Cascade)
    lessonProgress LessonProgress[]
    
    @@unique([userId, courseId])
    @@index([userId])
    @@index([courseId])
  }
  ```

- **Model: LessonProgress**
  ```prisma
  model LessonProgress {
    id           String   @id @default(cuid())
    enrollmentId String
    lessonId     String
    completed    Boolean  @default(false)
    lastPosition Int      @default(0) // Video position in seconds
    completedAt  DateTime?
    updatedAt    DateTime @updatedAt
    
    enrollment Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
    lesson     Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)
    
    @@unique([enrollmentId, lessonId])
    @@index([enrollmentId])
  }
  ```

### 3.5 Exam & Assignment Schema
- **Model: Exam**
  ```prisma
  model Exam {
    id        String   @id @default(cuid())
    courseId  String
    title     String
    duration  Int      // Duration in minutes
    questions Json     // Array of question objects
    startDate DateTime?
    endDate   DateTime?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    course       Course        @relation(fields: [courseId], references: [id], onDelete: Cascade)
    examAttempts ExamAttempt[]
    
    @@index([courseId])
  }
  ```

- **Model: ExamAttempt**
  ```prisma
  model ExamAttempt {
    id         String   @id @default(cuid())
    examId     String
    userId     String
    answers    Json     // User's answers
    score      Float?
    submittedAt DateTime?
    createdAt  DateTime @default(now())
    
    exam Exam @relation(fields: [examId], references: [id], onDelete: Cascade)
    user User @relation(fields: [userId], references: [id], onDelete: Cascade)
    
    @@unique([examId, userId])
    @@index([examId])
    @@index([userId])
  }
  ```

- **Model: Assignment**
  ```prisma
  model Assignment {
    id          String    @id @default(cuid())
    courseId    String
    title       String
    description String?
    dueDate     DateTime?
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt
    
    course      Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)
    submissions Submission[]
    
    @@index([courseId])
  }
  ```

- **Model: Submission**
  ```prisma
  model Submission {
    id           String    @id @default(cuid())
    assignmentId String
    userId       String
    content      String?   // Text submission
    fileUrl      String?   // File upload URL
    grade        Float?
    feedback     String?
    submittedAt  DateTime  @default(now())
    gradedAt     DateTime?
    
    assignment Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
    user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
    
    @@unique([assignmentId, userId])
    @@index([assignmentId])
    @@index([userId])
  }
  ```

### 3.6 Live Classes Schema
- **Model: LiveClass**
  ```prisma
  model LiveClass {
    id          String   @id @default(cuid())
    courseId    String
    title       String
    platform    Platform
    meetingUrl  String
    scheduledAt DateTime
    duration    Int      // Duration in minutes
    recordingUrl String?
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    
    course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
    
    @@index([courseId])
    @@index([scheduledAt])
  }
  
  enum Platform {
    ZOOM
    GOOGLE_MEET
    MICROSOFT_TEAMS
    OTHER
  }
  ```

### 3.7 AI Chat Schema
- **Model: AIChat**
  ```prisma
  model AIChat {
    id        String   @id @default(cuid())
    userId    String
    courseId  String?
    lessonId  String?
    messages  Json     // Array of chat messages
    context   Json?    // Additional context
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
    course Course? @relation(fields: [courseId], references: [id], onDelete: SetNull)
    lesson Lesson? @relation(fields: [lessonId], references: [id], onDelete: SetNull)
    
    @@index([userId])
    @@index([courseId])
  }
  ```

### 3.8 Notification Schema
- **Model: Notification**
  ```prisma
  model Notification {
    id        String           @id @default(cuid())
    userId    String
    type      NotificationType
    title     String
    message   String
    read      Boolean          @default(false)
    link      String?
    createdAt DateTime         @default(now())
    
    user User @relation(fields: [userId], references: [id], onDelete: Cascade)
    
    @@index([userId])
    @@index([read])
  }
  
  enum NotificationType {
    COURSE_UPDATE
    LIVE_CLASS
    EXAM_REMINDER
    ASSIGNMENT_DUE
    GRADE_RELEASED
    ACHIEVEMENT
    SYSTEM
  }
  ```

### 3.9 Gamification Schema
- **Model: Badge**
  ```prisma
  model Badge {
    id        String   @id @default(cuid())
    userId    String
    type      BadgeType
    earnedAt  DateTime @default(now())
    
    user User @relation(fields: [userId], references: [id], onDelete: Cascade)
    
    @@index([userId])
  }
  
  enum BadgeType {
    FIRST_LESSON
    COURSE_COMPLETE
    WEEK_STREAK
    MONTH_STREAK
    PERFECT_SCORE
    EARLY_BIRD
    DEDICATED_LEARNER
  }
  ```

- **Model: Streak**
  ```prisma
  model Streak {
    id            String   @id @default(cuid())
    userId        String   @unique
    currentStreak Int      @default(0)
    longestStreak Int      @default(0)
    lastActiveDate DateTime?
    updatedAt     DateTime @updatedAt
    
    user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
  ```

---

## Step 4: Create Prisma Client Utility

### 4.1 Create Prisma Client Singleton
- **Location:** `lib/db/prisma.ts`
- **Purpose:** Prevent multiple Prisma Client instances in development
- **Code:**
  ```typescript
  import { PrismaClient } from '@prisma/client'

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  export const prisma = globalForPrisma.prisma ?? new PrismaClient()

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
  ```

**Files Created:**
- `lib/db/prisma.ts`

---

## Step 5: Generate Prisma Client

### 5.1 Generate Client
- **Command:** `npx prisma generate`
- This creates TypeScript types based on schema
- Run after every schema change

### 5.2 Create Migration
- **Command:** `npx prisma migrate dev --name init`
- Creates initial migration
- Applies to database

**Files Created:**
- `prisma/migrations/` directory with migration files

---

## Step 6: Create Database Query Utilities

### 6.1 Create Query Helper Functions
- **Location:** `lib/db/queries/`
- **Files:**
  - `courses.ts` - Course queries
  - `users.ts` - User queries
  - `enrollments.ts` - Enrollment queries
  - `exams.ts` - Exam queries
  - `analytics.ts` - Analytics queries

### 6.2 Implement Tenant-Aware Queries
- All queries must filter by `tenantId`
- Create helper function: `withTenant(tenantId, query)`

**Files Created:**
- `lib/db/queries/courses.ts`
- `lib/db/queries/users.ts`
- `lib/db/queries/enrollments.ts`
- `lib/db/queries/exams.ts`
- `lib/db/queries/analytics.ts`
- `lib/db/queries/index.ts` (exports)

---

## Step 7: Set Up Prisma Studio (Optional)

### 7.1 Add Script
- **Location:** `package.json`
- **Script:** `"db:studio": "prisma studio"`
- Useful for database inspection during development

**Files Modified:**
- `package.json`

---

## Step 8: Create Seed Script

### 8.1 Create Seed File
- **Location:** `prisma/seed.ts`
- **Purpose:** Populate database with initial data for development
- Seed data:
  - Sample tenant
  - Admin user
  - Sample courses
  - Sample modules/lessons

### 8.2 Configure Seed in package.json
- **Location:** `package.json`
- **Add:** `"prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }`

**Files Created:**
- `prisma/seed.ts`

**Files Modified:**
- `package.json`

---

## Step 9: Database Indexes & Performance

### 9.1 Review and Add Indexes
- Ensure indexes on:
  - Foreign keys (`tenantId`, `userId`, `courseId`)
  - Frequently queried fields (`email`, `subdomain`)
  - Date fields for sorting (`createdAt`, `scheduledAt`)

### 9.2 Add Composite Indexes
- For common query patterns:
  - `@@index([tenantId, status])` on Course
  - `@@index([userId, completed])` on LessonProgress

**Files Modified:**
- `prisma/schema.prisma`

---

## Step 10: Create Type Definitions

### 10.1 Export Prisma Types
- **Location:** `types/db.ts`
- Export commonly used types:
  ```typescript
  import { User, Course, Enrollment, Tenant } from '@prisma/client'
  
  export type { User, Course, Enrollment, Tenant }
  ```

**Files Created:**
- `types/db.ts`

---

## Deliverables Checklist

- [ ] Prisma ORM installed and initialized
- [ ] PostgreSQL connection configured
- [ ] Complete database schema designed with all models
- [ ] Prisma Client generated
- [ ] Initial migration created and applied
- [ ] Prisma Client utility created (`lib/db/prisma.ts`)
- [ ] Database query utilities created
- [ ] Seed script created
- [ ] Type definitions exported
- [ ] Database indexes optimized
- [ ] Prisma Studio script added

---

## File Structure Summary

### Created Files:
- `prisma/schema.prisma` (complete schema)
- `lib/db/prisma.ts` (Prisma Client singleton)
- `lib/db/queries/courses.ts`
- `lib/db/queries/users.ts`
- `lib/db/queries/enrollments.ts`
- `lib/db/queries/exams.ts`
- `lib/db/queries/analytics.ts`
- `lib/db/queries/index.ts`
- `prisma/seed.ts`
- `types/db.ts`

### Modified Files:
- `.env` (DATABASE_URL)
- `.env.example` (DATABASE_URL placeholder)
- `package.json` (scripts)

### Created Directories:
- `prisma/migrations/`
- `lib/db/queries/`

---

## Next Steps

After completing Phase 1.2, proceed to:
- **Phase 1.3**: Authentication Foundation (NextAuth.js)

---

## Notes

- Always use `tenantId` in queries for multi-tenancy
- Use Prisma migrations for all schema changes
- Never edit migration files manually
- Run `prisma generate` after schema changes
- Use transactions for complex operations
- Index foreign keys and frequently queried fields

