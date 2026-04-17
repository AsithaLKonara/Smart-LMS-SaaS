# Calendar + live classes

## Scheduling

- **Create:** instructor or admin on a course they manage.
- **Storage:** `LiveClass.scheduledAt` in UTC; display using `User.timezone` or `Tenant.timezone`.

## Join

- `meetingUrl` opens external provider; embed v2.

## Attendance

- `LiveClassAttendance`: per user join/leave timestamps; optional “present” rollup.

## Recordings

- `recordingUrl` set when available; visibility = enrolled students + staff.

## Event types (calendar UI)

- Live session, assignment due, exam window (aggregated from domain models).
