# 📋 Functional Reference - Alumni Management Portal

This document serves as a comprehensive feature and capabilities specification for the Alumni Management Portal, mapping every frontend user view and functionality available across the four distinct user roles.

---

## 1. Role Access Permissions Matrix

| Feature | Alumni | Mentor | Coordinator | Admin |
|---------|:------:|:------:|:-----------:|:-----:|
| View Public Landing Page | ✅ | ✅ | ✅ | ✅ |
| Manage Personal Account & Profile | ✅ | ✅ | ✅ | ✅ |
| Browse Alumni Directory | ✅ | ✅ | ✅ | ✅ |
| Send 1:1 Direct Messages | ✅ | ✅ | ✅ | ✅ |
| Join Batch Group Chats | ✅ | ✅ | — | — |
| Register & RSVP for Events | ✅ | ✅ | ✅ | ✅ |
| View Photo Gallery (Lightbox) | ✅ | ✅ | ✅ | ✅ |
| Apply to Jobs | ✅ | ✅ | — | — |
| Submit Job Postings | ✅ | ✅ | ✅ | ✅ |
| Approve Jobs (Dept-scoped) | — | — | ✅ | ✅ |
| Approve Jobs (Global) | — | — | — | ✅ |
| Request Mentorship | ✅ | — | — | — |
| Approve Mentee Requests | — | ✅ | — | ✅ |
| Approve New User Accounts | — | ✅* | ✅ | ✅ |
| Nominate Top Alumni | — | — | ✅ | ✅ |
| Manage Departments Config | — | — | — | ✅ |
| View System-Wide Analytics | — | — | Dept-scoped | ✅ |
| Manage Landing Testimonials | — | — | — | ✅ |

*Note: In `views.py`, registration approvals are currently mapped to Mentors (`IsMentorOrAdmin`), while the functional specification lists it as a Coordinator/Admin action. This permission alignment will be resolved during final backend integration.*

---

## 2. Detailed Alumni View Module (`pages/alumni/`)

Alumni users have access to 10 key page views inside their dashboard system:

- **Dashboard (`dashboard.html`):** Personalized landing page. Displays stats (total alumni, active mentors, events, jobs), cards for upcoming events, recent activity alerts (notifications), and quick-view job postings.
- **My Profile (`profile.html`):** Profile details page. Supports full CRUD. Contains:
  - *Personal Info:* Email, phone, location, DOB.
  - *Academic Details:* Department, batch year, roll number, assigned batch mentor.
  - *Professional Details:* Job title, company, experience years, skills.
  - *Resume Manager:* Displays uploaded PDF details.
  - *AI Resume Parser:* Drag-and-drop box. Dropping a resume triggers a mock parser that auto-populates input fields automatically using simulated NLP extraction.
- **Alumni Network (`network.html`):** Searchable directory. Offers filters by name, role, graduation batch, and company. Includes a bookmarking toggle and a "Connect" request handler.
- **Group & Private Chat (`chat.html`):** Full messaging center. Supports 1:1 direct threads and auto-joined batch group chats (e.g., "Batch 2020 Group"). Features interactive typing indicators and simulated reply delays.
- **Job Board (`jobs.html`):** Lists career postings. Filterable by job type (Full-time, Internship) and experience level. Includes application forms (requires cover letters) and a job posting sub-panel.
- **Mentorship (`mentorship.html`):** Shows assigned batch mentors, lets alumni request new mentors, view session schedules, and browse shared resources.
- **Events (`events.html`):** List of reunions, guest talks, and campus placements. Allows users to click "Register Now" to RSVP.
- **Gallery (`gallery.html`):** Image grid showcasing campus memories and reunions. Filterable by category (Campus, Events, Reunion, Sports, Cultural) with an interactive Lightbox popup viewer (supports arrow navigation and escape close).
- **Notifications (`notifications.html`):** Lists all alerts. Divided into Social, Events, and System streams with "Mark All Read" and individual item dismissal functions.
- **Settings (`settings.html`):** Security and account management. Enforces password changes (checks current password and validates new password length), toggles email notifications, and controls profile search visibility.

---

## 3. Detailed Mentor View Module (`pages/mentor/`)

Mentors guide students and approve registrations of graduates in their department:

- **Dashboard (`dashboard.html`):** Shows counts of active mentees and pending requests, lists recent system-wide announcements, and displays notifications.
- **Approvals Panel (`approvals.html`):** A dual-pane panel:
  - *Mentee Requests:* List of mentorship applications. Mentors approve or reject requests within their maximum capability limit (`max_mentees`).
  - *Registration Approvals:* Pending alumni registrations requiring academic detail checks (Roll Number, Batch) before gaining access.
- **Active Mentees (`alumni.html`):** Lists approved mentees with quick contact buttons (email, chat thread), academic profiles, and progress reports.
- **Mentorship Chat (`chat.html`):** Dedicated chat interface connecting mentors with their mentees and coordinator groups.
- **Events (`events.html`):** Lists college and department events; allows mentors to request guest lecture slots.
- **Settings (`settings.html`):** Includes standard account settings plus profile configurations for defining specialized skills, office hours, and maximum mentee capacities.

---

## 4. Detailed Coordinator View Module (`pages/coordinator/`)

Coordinators supervise placements and track graduates at a department level:

- **Dashboard (`dashboard.html`):** Analytics-heavy. Shows charts of placement rates by department, counts of pending job posts, and active mentors.
- **Alumni Management (`alumni.html`):** Searchable list of department graduates. Allows coordinators to view detailed career histories and export reports.
- **Jobs Verification Panel (`jobs.html`):** Moderation queue for job posts submitted by alumni. Coordinators review descriptions and approve them (passing them to Admin review) or reject them to prevent spam.
- **Mentors Management (`mentors.html`):** Department directory of faculty mentors. Coordinates batch mentor assignments and tracks capacity.
- **Top Alumni Nominations (`top-alumni.html`):** Form to nominate distinguished alumni for the college "Hall of Fame" marquee based on professional milestones.
- **Chat, Events, Notifications, and Settings:** Shared views scoped to the coordinator's department.

---

## 5. Detailed Admin View Module (`pages/admin/`)

Administrators have global system administration rights:

- **Dashboard (`dashboard.html`):** Global metrics board monitoring total users, system health, database load, and platform engagement indices.
- **Departments Editor (`departments.html`):** Full CRUD editor to add new departments (e.g., Computer Engineering), modify course codes (COMP), and toggle active/inactive status.
- **User Moderation Panel (`alumni.html` / `mentors.html`):** Direct overrides on all user accounts. Admins can manually modify roles, override status codes, or suspend/delete users.
- **Global Job Board Control (`jobs.html`):** Direct moderation on all jobs. Admins bypass the coordinator step, directly approve jobs to the board, or edit/delete any posting.
- **Global Events Planner (`events.html`):** Create and schedule college-wide events, specify category metadata, and manage RSVPs.
- **Public Content Manager (`settings.html`):** Editor to manage dynamic landing page features:
  - *Testimonial CRUD:* Edit or add graduate cards.
  - *Why Join CRUD:* Customize landing page icon grids and benefit descriptions.
