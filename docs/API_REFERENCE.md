# 🔌 API Reference — Alumni Management Portal

> Complete endpoint documentation for the Django REST Framework backend.  
> **Base URL**: `http://localhost:8000/api/`

---

## 🔐 Authentication & Security

All private endpoints require an `Authorization` header containing a valid Bearer Token.

### Token Generation (Login)
**`POST /api/auth/token/`**
- **Auth Required:** No
- **Payload:**
```json
{ "email": "user@example.com", "password": "secure123" }
```
- **Returns:**
```json
{ "access": "eyJhb...", "refresh": "eyJhb..." }
```

### Token Refresh
**`POST /api/auth/token/refresh/`**
- **Auth Required:** No (uses refresh token)
- **Payload:**
```json
{ "refresh": "eyJhb..." }
```
- **Returns:**
```json
{ "access": "new_eyJhb..." }
```

### Password Change
**`POST /api/users/change_password/`**
- **Auth Required:** Yes (Bearer)
- **Payload:**
```json
{ "old_password": "current123", "new_password": "newsecure456" }
```
- **Returns:**
```json
{ "detail": "Password changed successfully." }
```

---

## 📊 Page-Wise Aggregate Endpoints

These endpoints combine multiple queries into a single response to prevent frontend waterfall loading.

### Homepage
**`GET /api/pages/homepage/`**
- **Auth Required:** No
- **Purpose:** Delivers all data for `index.html`
- **Returns:**
```json
{
  "stats": { "totalAlumni": 125, "companiesHiring": 35, "eventsConducted": 18, "activeMentors": 12, "studentsPlaced": 87, "jobPostings": 24 },
  "topAlumni": [ ... ],
  "jobs": [ ... ],
  "events": [ ... ],
  "testimonials": [ ... ],
  "whyJoin": [ ... ]
}
```

### Alumni Dashboard
**`GET /api/pages/dashboard/alumni/`**
- **Auth Required:** Yes (Bearer)
- **Returns:**
```json
{
  "announcements": [...],
  "upcoming_events": [...],
  "recommended_jobs": [...],
  "unread_messages": 3,
  "unread_notifications": 5
}
```

### Mentor Dashboard
**`GET /api/pages/dashboard/mentor/`**
- **Auth Required:** Yes (Bearer)
- **Returns:**
```json
{
  "pending_requests_count": 4,
  "active_mentees_count": 12,
  "pending_requests": [...],
  "announcements": [...]
}
```

### Coordinator Dashboard
**`GET /api/pages/dashboard/coordinator/`**
- **Auth Required:** Yes (Coordinator or Admin role)
- **Returns:**
```json
{
  "pending_jobs_count": 3,
  "pending_jobs": [...],
  "department_alumni_count": 45,
  "pending_alumni_count": 2,
  "department_mentors_count": 5,
  "announcements": [...]
}
```

### Admin Dashboard
**`GET /api/pages/dashboard/admin/`**
- **Auth Required:** Yes (Admin role)
- **Returns:**
```json
{
  "total_users": 500,
  "total_alumni": 400,
  "total_mentors": 20,
  "total_coordinators": 10,
  "pending_registrations": 5,
  "total_jobs": 100,
  "approved_jobs": 80,
  "pending_jobs": 12,
  "total_events": 25,
  "total_departments": 6,
  "announcements": [...]
}
```

---

## 👤 User Management

### User CRUD
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/users/` | No | Register a new user |
| `GET` | `/api/users/` | Yes | List all users (paginated) |
| `GET` | `/api/users/{id}/` | Yes | Get user by ID |
| `PATCH` | `/api/users/{id}/` | Yes (Owner/Admin) | Update user |
| `DELETE` | `/api/users/{id}/` | Yes (Owner/Admin) | Delete user |

### User Actions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET/PATCH` | `/api/users/me/` | Yes | Get or update the authenticated user |
| `POST` | `/api/users/change_password/` | Yes | Change password |
| `POST` | `/api/users/{id}/approve/` | Yes (Mentor/Admin) | Approve pending user |
| `POST` | `/api/users/{id}/reject/` | Yes (Mentor/Admin) | Reject pending user |

---

## 💼 Job Board

### Job CRUD
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/jobs/` | Optional | List all jobs |
| `POST` | `/api/jobs/` | Yes | Create a job posting |
| `GET` | `/api/jobs/{id}/` | Optional | Get job details |
| `PATCH` | `/api/jobs/{id}/` | Yes | Update a job |
| `DELETE` | `/api/jobs/{id}/` | Yes | Delete a job |

### Job Actions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/jobs/{id}/apply/` | Yes | Apply to a job (creates `JobApplication`) |
| `POST` | `/api/jobs/{id}/approve_job/` | Yes (Coordinator/Admin) | Approve job posting |
| `POST` | `/api/jobs/{id}/reject_job/` | Yes (Coordinator/Admin) | Reject job posting |

### Job Applications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/job-applications/` | Yes | List your applications (admin sees all) |

---

## 🤝 Mentorship

### Mentorship Request CRUD
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/mentorship-requests/` | Yes | Create a mentorship request |
| `GET` | `/api/mentorship-requests/` | Yes | List mentorship requests |

### Mentorship Actions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/mentorship-requests/{id}/approve/` | Yes (Assigned Mentor) | Approve request (checks `max_mentees`) |
| `POST` | `/api/mentorship-requests/{id}/reject/` | Yes (Assigned Mentor) | Reject request |

---

## 📝 Network Feed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/feed/` | Optional | List all posts |
| `POST` | `/api/feed/` | Yes | Create a post |
| `POST` | `/api/feed/{id}/like/` | Yes | Toggle like on a post |
| `POST` | `/api/comments/` | Yes | Add a comment to a post |

---

## 💬 Messaging

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/messages/` | Yes | List user's messages |
| `POST` | `/api/messages/` | Yes | Send a message |
| `PATCH` | `/api/messages/{id}/mark_read/` | Yes | Mark a message as read |
| `POST` | `/api/messages/mark_all_read/` | Yes | Mark all messages as read |

---

## 🔔 Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/notifications/` | Yes | List user's notifications |
| `PATCH` | `/api/notifications/{id}/mark_read/` | Yes | Mark notification as read |
| `POST` | `/api/notifications/mark_all_read/` | Yes | Mark all as read |

---

## 📅 Events

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/events/` | Optional | List all events |
| `POST` | `/api/events/` | Yes (Coordinator/Admin) | Create an event |
| `POST` | `/api/event-attendees/` | Yes | Register for an event |

---

## 🖼️ Other Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/gallery/` | No | List gallery items |
| `GET` | `/api/departments/` | Yes | List departments |
| `GET` | `/api/profiles/alumni/` | Yes | List alumni profiles |
| `GET` | `/api/profiles/mentors/` | Yes | List mentor profiles |
| `GET/POST` | `/api/social-links/` | Yes | Manage social links |
| `GET/POST` | `/api/experiences/` | Yes | Manage work experience |
| `GET` | `/api/announcements/` | Yes | List announcements |
| `GET` | `/api/testimonials/` | No | List testimonials |
| `GET` | `/api/why-join/` | No | List "Why Join" items |
