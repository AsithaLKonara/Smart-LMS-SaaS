# Hypercare Checklist (48-72 Hours)

## Before Launch

- [ ] On-call roster confirmed for launch window.
- [ ] Alert channels tested.
- [ ] Rollback owner assigned.
- [ ] Support escalation path published.

## First 2 Hours

- [ ] Verify auth conversion and successful login rate.
- [ ] Check API error rates (`/api/messaging`, `/api/assets`, `/api/billing`).
- [ ] Validate p95 latency for dashboard routes.
- [ ] Confirm no abnormal DB connection saturation.

## Daily During Hypercare

- [ ] Review failed jobs and webhook delivery issues.
- [ ] Review top support tickets and repeat patterns.
- [ ] Confirm invoice generation and usage metrics updates.
- [ ] Track tenant onboarding conversion and drop-offs.

## Exit Criteria

- [ ] Incident volume normal for 24h window.
- [ ] No open P1/P2 issues.
- [ ] Critical funnel metrics stable.
- [ ] Action items handed off to normal sprint backlog.
