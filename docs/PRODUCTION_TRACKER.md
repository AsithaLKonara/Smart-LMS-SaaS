# Smart LMS Production Tracker

Last updated: 2026-04-18

This is the canonical execution tracker for production completion. It consolidates status from:
- `docs/TODO_SUMMARY.md`
- `docs/PHASE_13_PLAN.md`
- `docs/SaaS_LMS_MASTER_PLAN.md`

## 1) Pending Product Modules

- [ ] Messaging / Inbox (Phase 13.2)
  - [ ] Conversation list
  - [ ] Thread view and composer
  - [ ] Course-scoped messaging
  - [ ] API routes with tenant-safe reads/writes
- [ ] Asset Library / SCORM (Phase 13.3)
  - [ ] Asset upload metadata model
  - [ ] Asset browser with type filters
  - [ ] SCORM package metadata and status
  - [ ] API routes with role controls
- [ ] Billing & Metering (Phase 13.4)
  - [ ] Current plan and usage view
  - [ ] Invoices list and download links
  - [ ] Usage meter and limits
  - [ ] Billing APIs + tenant guardrails

## 2) Remaining Refreshes

- [ ] Gradebook
- [ ] Users / People
- [ ] Cohorts
- [ ] Calendar
- [ ] Analytics
- [ ] Integrations
- [ ] Settings (Org)
- [ ] Security / Audit
- [ ] Help Center

## 3) RBAC and Tenant Isolation

- [ ] Enforce route-level checks for dashboard pages
- [ ] Enforce API-level checks in all mutable endpoints
- [ ] Add shared authz helper for role + tenant checks
- [ ] Add tenant ownership filters for all tenant-bound queries

## 4) Test and CI Gates

- [ ] Role-based access tests
- [ ] Tenant isolation tests
- [ ] Messaging/Billing/Asset module tests
- [ ] CI gates: typecheck + lint + unit + e2e smoke

## 5) Production Infrastructure

- [ ] Env matrix: local / preview / production
- [ ] Managed Postgres backup and retention policy
- [ ] Deployment and migration runbook
- [ ] Secret inventory and rotation policy

## 6) Launch Operations

- [ ] Structured logging and error tracking integration
- [ ] Alert routing and on-call ownership
- [ ] Incident playbooks (P1/P2)
- [ ] Hypercare checklist (48-72 hours)

## Release Exit Criteria

- [ ] All pending modules shipped and validated
- [ ] All refresh pages upgraded and smoke-tested
- [ ] RBAC/tenant isolation verified in tests
- [ ] CI green on release branch
- [ ] Staging sign-off complete
- [ ] Production runbook rehearsed
