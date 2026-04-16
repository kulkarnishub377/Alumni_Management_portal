# Portal Pages `(/pages)`

Welcome to the isolated routing ecosystem of the platform.

To radically improve web performance and ensure maximum security through strict code separation, the portal has moved away from a complex SPA router. Instead, it utilizes structural sandboxing where user environments are split into distinct, specialized subdirectories.

## Routing Philosophy

Each subdirectory functions as an independent module. When a user logs in, they are aggressively re-routed to their respective directory based on their designated Role. This entirely prevents unauthorized roles from incidentally executing or rendering complex JS/DOM structures meant for highly privileged users.

### Subdirectories Overview

- `/auth`: Registration scopes, generic user flows, password resets.
- `/admin`: The superuser layer. Controls platform-wide policies, overarching user moderation, and systemic analytics.
- `/coordinator`: The departmental manager scope. Perfect for faculty members orchestrating jobs and events.
- `/mentor`: A specialized environment for senior alumni explicitly consenting to provide career or academic guidance.
- `/alumni`: The massive, standardized sandbox for general alumni to reconnect, consume content, apply for opportunities, and network.

## Standard Practices
- All pages heavily utilize `<script src="../../assets/js/data.js"></script>` to sync with the global database mapping.
- Component layouts remain mostly consistent across subdirectories, ensuring an intuitive UX across all roles.
