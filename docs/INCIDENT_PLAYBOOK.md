# Incident Playbook

## Severity Definitions

- P1: Platform unusable for multiple tenants or critical data/security risk.
- P2: Major degradation with partial workaround available.

## Incident Command Structure

- Incident Commander: owns coordination and updates.
- Ops Driver: executes mitigation and rollback actions.
- Comms Owner: updates internal stakeholders.

## P1 Response

1. Acknowledge incident in under 5 minutes.
2. Freeze non-essential deployments.
3. Triage blast radius:
   - affected tenants
   - affected modules
   - data integrity risk
4. Mitigate:
   - rollback deployment if recent regression
   - disable faulty feature flag where possible
5. Publish status updates every 15 minutes until stabilized.
6. Create postmortem within 24 hours.

## P2 Response

1. Acknowledge in under 15 minutes.
2. Route to owning team and capture workaround.
3. Publish updates every 30 minutes if user-visible.
4. Track corrective actions to completion.

## Recovery Verification Checklist

- Error rate back to baseline.
- Auth and core dashboard routes healthy.
- No ongoing migration or queue backlog anomalies.
- Support confirms issue no longer reproducible.
