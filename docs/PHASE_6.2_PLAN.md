# Phase 6.2: Exams & Assignments Implementation Plan

## Objective
Implement assessment tools including timed exams with various question types and file-submission assignments.

## 1. Data Model (✅ Schema Ready)
- [x] `Exam`, `ExamAttempt`, `Assignment`, `Submission` models exist.

## 2. Instructor: Create Assessments (✅ Implemented)
- [x] **Exam Builder**:
  - Add Questions (MCQ, Short Answer).
  - Set Timer & Passing Score.
  - Set Availability Window.
- [ ] **Assignment Builder**: (Pending later)
  - Title, Description, Due Date.
  - Attachment support.

## 3. Student: Take Assessment (⚠️ Partially Implemented)
- [x] **Exam Runner Interface** (✅ Implemented):
  - Full-screen mode.
  - Countdown timer.
  - Question navigation.
  - Auto-submit on timeout.
  - Auto-save progress.
- [x] **Assignment Submit Interface** (✅ Implemented):
  - File upload (URL placeholder as MVP).
  - Text area for content.
  - Resubmission support.

## 4. Grading & Feedback (✅ Implemented)
- [x] **Auto-grading**: For MCQ exams.
- [x] **Manual Grading**: Instructor interface to view submissions and assign grades/feedback.

## File Structure
```
app/(dashboard)/
  (instructor)/courses/[id]/exams/
    new/page.tsx               # Exam builder
  (student)/courses/[id]/exams/
    [examId]/take/page.tsx     # Exam runner interface
  (student)/courses/[id]/assignments/
    [assignId]/page.tsx        # Assignment submission
```
