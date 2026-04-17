# Learning progression

## Progress model

- **Lesson:** complete / incomplete via `LessonProgress`.
- **Module progress:** derived: all child lessons complete.
- **Course progress:** `(completedLessons / totalLessons) * 100` plus optional weighting from graded items in future.

## Completion triggers (`Lesson.completionMode`)

| Mode | Rule |
|------|------|
| MANUAL | Student clicks complete; API validates enrollment + prerequisites. |
| VIDEO_THRESHOLD | `lastPosition / duration >= lesson.videoCompletionThreshold` (default 0.9) via heartbeat API. |
| QUIZ_PASS | Future: linked exam meets pass score. |

## Prerequisites

- `LessonPrerequisite`: lesson L requires lesson R completed for the same enrollment before L can be opened or completed.

## Resume

- `LessonProgress.lastPosition` drives “Continue watching”.
- Next lesson: first incomplete lesson in module order after current.

## Locks

- Locked lesson UI: show reason (“Complete: {prerequisite title}”) and CTA to that lesson.
