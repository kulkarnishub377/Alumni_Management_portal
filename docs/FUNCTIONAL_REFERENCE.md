# 📋 Functional Reference - Alumni Management Portal

This document serves as a comprehensive feature and capabilities specification for the Alumni Management Portal, mapping every frontend user view and functionality available across the four distinct user roles.

---

## 1. Role Access Permissions Matrix

| Feature | Alumni | Mentor | Coordinator | Admin |
|---|:---:|:---:|:---:|:---:|
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

## 2. Registration Wizard Forms & Fields

The registration interface (`pages/auth/register.html`) is a multi-step registration wizard. The client enforces field validations prior to allowing transitions.

### Step 1: Personal Details
- **First Name** (`input[type="text"]`): Required.
- **Last Name** (`input[type="text"]`): Required.
- **Email Address** (`input[type="email"]`): Required. Validates email structure.
- **Phone Number** (`input[type="tel"]`): Required.
- **Date of Birth** (`input[type="date"]`): Required.
- **Profile Photo** (`input[type="file"]`): Optional. Restricts uploads to files under 2MB (verified on client side).

### Step 2: Academic Credentials
- **Department** (`select`): Required. Options:
  - Computer Engineering
  - Information Technology
  - Mechanical Engineering
  - Civil Engineering
  - Electronics & Telecom
  - Electrical Engineering
- **Graduation Batch** (`select`): Required. Year range (1983 - Current).
- **Role Type** (`select`): Required. Options: `alumni`, `mentor`.
- **Roll Number** (`input[type="text"]`): Required. Used for academic verification checks.

### Step 3: Professional Info & Socials
- **Job Title** (`input[type="text"]`): Optional.
- **Company** (`input[type="text"]`): Optional.
- **Key Skills** (`input[type="text"]`): Optional. Comma-separated list.
- **Location & State** (`input[type="text"]`): Optional.
- **Years of Experience** (`select`): Optional. Options: `Fresher`, `1-2 years`, `2-5 years`, `5-10 years`, `10+ years`.
- **LinkedIn URL** (`input[type="url"]`): Optional. Validates URL format.
- **GitHub URL** (`input[type="url"]`): Optional. Validates URL format.
- **Password** (`input[type="password"]`): Required. Enforces a minimum length of 8 characters. Evaluated by a password strength meter (Very Weak to Very Strong).

---

## 3. Simulated AI Resume Parser NLP Data Mapping

The registration form and edit profile modal contain an **AI Resume Auto-Filler Box**. When a user uploads or drops a resume PDF, the parser simulates text extraction to auto-fill the forms:

| Target Field | Mock Extracted Value | Field ID / Selector |
|---|---|---|
| First Name | Alexander | `#step1` Text Input 1 |
| Last Name | Innovator | `#step1` Text Input 2 |
| Phone Number | +91 9876543210 | `#step1` Tel Input |
| Department | Computer Engineering | `#step2` Select Input 1 |
| Batch Year | 2022 | `#step2` Select Input 2 |
| Job Title | Senior Machine Learning Engineer | `#step3` Text Input 1 |
| Company | Amazon Web Services | `#step3` Text Input 2 |
| Key Skills | Python, TensorFlow, System Design, React | `#step3` Text Input 3 |
| Location City | Bangalore | `#step3` Text Input 4 |
| Location State| Karnataka | `#step3` Text Input 5 |
| Experience | 2-5 years | `#step3` Select Input |

---

## 4. Chat & Messaging Center Capabilities

The chat view (`pages/alumni/chat.html`) acts as an interactive messaging client:

### A. Conversation Filtering
- **All:** Lists all active direct messages and batch group conversations.
- **Groups:** Filters conversations to show only batch groups. Groups are named using the convention `Batch <Year> Group` (e.g. "Batch 2020 Group").
- **Direct:** Filters to show only 1:1 chat threads with mentors or other alumni.

### B. Chat Functionalities
- **Live Typing Indicator:** When User A sends a message, a typing bubble is displayed for 2 seconds to simulate a response from User B.
- **Auto-Replies:** The mock service responds to messages with randomly selected replies to simulate a live chat experience.
- **Attachments Menu (Mock):** Clicking the attachment clip or emoji icons triggers a toast notification stating that the features are coming soon.
- **Voice/Video Calls (Mock):** Displays call icons. Clicking them displays a connection notice to simulate a call.

---

## 5. Administrative Configuration Utilities

The Admin Dashboard (`pages/admin/dashboard.html`) provides global configuration options:

### A. Department Configuration CRUD (`departments.html`)
- **Add Department:** Opens a modal. Requires a department name (e.g. Electrical Engineering) and a unique department code (e.g. ELEC).
- **Edit Department:** Allows updating the department name or code.
- **Toggle Status:** Allows set status to `active` or `inactive` via a toggle switch. Inactive departments are hidden from the registration forms.

### B. User Registration Management (`alumni.html` / `mentors.html`)
- **Search Filters:** Filters user accounts by name, email, roll number, and registration status.
- **Action Overrides:** Admins can manually click "Approve" or "Reject" on any pending profile.
- **Delete User:** Deletes user accounts from the database.

### C. Homepage Content Managers (`settings.html`)
- **Testimonial Editor:** Admins can add, edit, or delete alumni testimonials.
- **Why Join Cards Editor:** Admins can update the landing page feature cards by selecting icons and modifying the description text.
- **Nominate Top Alumni:** Form to nominate alumni to the homepage showcase marquee.
