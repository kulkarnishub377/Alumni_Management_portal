# Coordinator Portal `(/pages/coordinator)`

This directory represents the mid-level management layer of the Alumni Portal, usually granted to specific verified faculty members or departmental heads.

## Capabilities

Coordinators sit between the standard Alumni and the Super Admins. They possess specialized dashboards focused heavily on driving engagement and curating opportunities.

- `dashboard.html`: Focused on operational throughput (Pending Job Approvals, Pending Event Requests).
- `jobs.html` & `events.html`: Grants elevated privileges to approve, deny, or elevate community-submitted postings before they iterate to the global `data.js` production pipeline.
- `alumni.html`: Directory access with limited modification capabilities. Can verify user accounts transitioning them out of an unverified onboarding state.
- `mentors.html`: Dedicated tooling to observe and arrange complex mentorship relationships between active students and high-pedigree alumni.
