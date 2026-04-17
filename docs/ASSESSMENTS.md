# Assessments (assignments + exams)

## Question types (exam JSON contract)

Validated with Zod (`lib/validations/exam-questions.ts`):

- `multiple_choice` (single)
- `multiple_select`
- `short_answer`
- `essay`
- `file_upload` (reference URL)

Each question: `id`, `prompt`, `points`, optional `options`, `correctIndices` (MCQ), `rubric` snippet.

## Assignments

- `totalPoints`, `dueDate`, `allowLate`, `latePenaltyPercent` (0–100), `maxSubmissions`, `rubric` (JSON).
- Submission: text + file URL; unique per user per assignment with resubmit count enforced.

## Exams

- `duration` minutes; `startDate` / `endDate` window; `maxAttempts` (default 1).
- Attempts: multiple rows per user if `maxAttempts` > 1 (see schema).

## Grading

- Instructor grades assignment; `Submission.gradedById`, `gradedAt`, `feedback`.
- **Grade history:** `SubmissionGradeHistory` append-only rows for audit.
- **Override:** ADMIN/SUPER_ADMIN only (`grade:override`).

## Late policy

- If `allowLate` false: reject after due + grace (grace optional future).
- If true: apply `latePenaltyPercent` to auto-calc score suggestion (instructor confirms).
