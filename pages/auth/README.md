# Authentication Flow `(/pages/auth)`

The entry gates to the Alumni Management portal. This directory holds the completely unauthenticated HTML structures responsible for converting generic web traffic into active user sessions.

- `login.html`: The standard entry interface targeting existing data profiles.
- `register.html`: The creation gateway containing validation requirements for onboarding Alumni. Usually prompts an event that creates an entity with an "Unverified" status awaiting Admin/Coordinator Approval.
