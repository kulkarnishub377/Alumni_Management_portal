# Admin Portal `(/pages/admin)`

This subdirectory encapsulates the highest level of authorization within the Alumni Portal. 

The Administrative interface offers comprehensive "God-Mode" overview over the entire platform, utilizing extensive dashboard analytics and specialized grid configurations.

## Responsibilities & Available Pages

- `dashboard.html`: The central hub providing macro-level statistics (Total Alumni, Job Postings, Active Mentors, Upcoming Events).
- `alumni.html`: The global unified directory with full access to modify profiles, ban users, and verify identities.
- `jobs.html` & `events.html`: Global tracking to monitor and moderate postings created by lower-tier roles (Coordinators or Alumni).
- `departments.html`: Control over the academic structures routing users together.
- `settings.html`: System-level configurations ensuring proper database sync.

⚠️ **Security Note**: In future backend implementations, all API requests spawned from this directory must include JWT verification validating a SUPERADMIN flag.
