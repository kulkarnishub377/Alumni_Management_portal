# 🏛️ System Architecture - Alumni Management Portal

This document provides a highly detailed architectural blueprint of the Alumni Management Portal. It outlines the multi-tiered server configurations, client decoupling, directory structures, complete relational data dictionaries for all 19 PostgreSQL tables, JWT auth lifecycles, and security controls.

---

## 1. Multi-Tier System Design & Decoupling

The platform follows a strict decoupled multi-tier architecture, segregating the presentation layer from backend business logic and storage interfaces.

```
+-----------------------------------------------------------------------+
|                              Client Tier                              |
|   +---------------------------------------------------------------+   |
|   |                       Vanilla JS Client                       |   |
|   |  - HTML5 Document Objects with role-segregated UI structures  |   |
|   |  - Custom CSS3 styling employing Glassmorphism design tokens   |   |
|   |  - Client Router (Hash-based SPA handler inside router.js)     |   |
|   |  - Local Storage JWT Token Cache & concurrency queues          |   |
|   |  - Mock Database service layer (data.js & apiFetch catch)     |   |
|   +---------------------------------------------------------------+   |
+-----------------------------------+-----------------------------------+
                                    | HTTPS (REST API / JSON Payload)
                                    v
+-----------------------------------------------------------------------+
|                            Application Tier                           |
|   +---------------------------------------------------------------+   |
|   |                 Django REST Framework (DRF 3.15)              |   |
|   |  - SimpleJWT Auth middleware (Token verification / refresh)   |   |
|   |  - Serializers (Validation rules, object nested mappings)     |   |
|   |  - Aggregated API views (Combines 5+ querysets into one GET)  |   |
|   |  - Config manager (Decouple for isolating environment variables) |   |
|   +---------------------------------------------------------------+   |
+-----------------------------------+-----------------------------------+
                                    | psycopg2 Database Driver
                                    v
+-----------------------------------------------------------------------+
|                               Data Tier                               |
|   +---------------------------------------------------------------+   |
|   |                      PostgreSQL Engine (14+)                  |   |
|   |  - 19 Normalized Relational Tables                            |   |
|   |  - Relational Foreign Keys, cascades, and constraints         |   |
|   |  - Hashed user password tables and composite indexes          |   |
|   +---------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

### Decoupled Integration Pattern
- **Static Frontend Hosting:** The client-side is entirely composed of static HTML, CSS, and Vanilla JavaScript. It can be served from any simple static server or edge CDN (such as Netlify, Vercel, or AWS S3).
- **Backend API Gateway:** The Django server runs on a separate port or domain (typically port `8000`). The client communicates with the backend exclusively via asynchronously dispatched HTTP requests (`fetch`), passing a JSON payload and receiving JSON objects.
- **Client Mock-Service Fallback:** The frontend is built to tolerate backend server outages. The `apiFetch` wrapper in `api.js` catches fetch connection failures and immediately shifts into a **mock fallback state**, populating pages from `data.js` and storing temporary actions in local storage. This enables demonstration runs without a running database.

---

## 2. Directory Structure Layout

```
Alumni_Management_portal/
│
├── index.html                      # Public portal landing page
├── package.json                    # Node.js dev tooling configuration
├── netlify.toml                    # Netlify deployment directives
│
├── assets/                         # Static Frontend Assets
│   ├── css/
│   │   ├── common.css              # Global tokens (colors, variables, transitions)
│   │   ├── homepage.css            # Public page style definitions
│   │   ├── auth.css                # Auth interfaces (login, multi-step register)
│   │   └── dashboard.css           # Glassmorphism panels, sidebars, grids
│   └── js/
│       ├── homepage.js             # Public page hydration engine
│       ├── dashboard.js            # Role SPA core template controller
│       ├── auth.js                 # Registration/login input validations
│       ├── common.js               # Shareable notifications (toast), escapeHTML
│       ├── data.js                 # Mock database
│       └── modules/
│           ├── api.js              # Token refresh queue, fetch interceptor
│           └── router.js           # View template swap manager
│
├── pages/                          # Role-Based HTML View Panels
│   ├── auth/
│   │   ├── login.html              # Secure Login Form
│   │   └── register.html           # Multi-step Register Wizard
│   ├── alumni/                     # Alumni Modules (profile, chat, network...)
│   ├── mentor/                     # Mentor Panels (approvals, mentees...)
│   ├── coordinator/                # Coordinator Views (job verification...)
│   └── admin/                      # Admin Utilities (department CRUD...)
│
└── backend/                        # Backend REST API
    ├── requirements.txt            # Python dependencies
    ├── manage.py                   # Django CLI utility
    ├── config/
    │   ├── settings.py             # Config (Middleware, databases, SimpleJWT)
    │   ├── urls.py                 # Main url routing
    │   └── wsgi.py                 # Server interface
    └── api/
        ├── models.py               # 19 Database models definitions
        ├── views.py                # CRUD ViewSets, custom aggregate views
        ├── serializers.py          # Serialization and validator classes
        ├── urls.py                 # API sub-routes mapping
        └── tests.py                # Django automated tests suite
```

---

## 3. JWT Authentication & Refresh Lifecycle

The system utilizes JSON Web Tokens (JWT) for secure, stateless user sessions. All private APIs require the token to be passed via the `Authorization: Bearer <Access Token>` HTTP header.

```
Client Application                    Django REST Backend                Local Storage
       |                                       |                               |
       |----- [1] Login Request -------------->|                               |
       |      (Email / Password)               |                               |
       |                                       |-- Verify Credentials          |
       |                                       |-- Generate JWT Tokens         |
       |<---- [2] Token Payload ---------------|                               |
       |      (Access & Refresh Tokens)        |                               |
       |                                                                       |
       |----- [3] Cache Tokens ----------------------------------------------->|
       |                                                                       |
       |----- [4] API Request ---------------->|                               |
       |      (Header: Bearer Access Token)    |                               |
       |                                       |-- Validate Token              |
       |<---- [5] 200 OK (JSON Data) ----------|                               |
       |                                                                       |
       |     *Access Token Expires (1 Hour)*                                   |
       |                                                                       |
       |----- [6] API Request ---------------->|                               |
       |      (Header: Bearer Expired Access)  |                               |
       |<---- [7] 401 Unauthorized ------------|                               |
       |                                                                       |
       |----- [8] Query Cache for Refresh ------------------------------------>|
       |<---- [9] Return Refresh Token ----------------------------------------|
       |                                                                       |
       |----- [10] Token Refresh ------------->|                               |
       |      (POST /auth/token/refresh/)      |                               |
       |                                       |-- Validate Refresh Token      |
       |                                       |-- Generate New Access Token   |
       |<---- [11] 200 OK (New Access Token) --|                               |
       |                                                                       |
       |----- [12] Cache New Access Token ------------------------------------>|
       |                                                                       |
       |----- [13] Replay Failed API Request ->|                               |
       |      (Header: Bearer New Access)      |                               |
       |<---- [14] 200 OK (JSON Data) ---------|                               |
       v                                       v                               v
```

### Advanced Token Settings (`settings.py`)
- **`ACCESS_TOKEN_LIFETIME`:** `timedelta(minutes=60)`
- **`REFRESH_TOKEN_LIFETIME`:** `timedelta(minutes=1440)` (24 Hours)
- **`ROTATE_REFRESH_TOKENS`:** `True` (Each token refresh generates a new access AND a new refresh token to mitigate replay attacks).
- **`BLACKLIST_AFTER_ROTATION`:** `False` (Can be set to `True` if `rest_framework_simplejwt.token_blacklist` is added, preventing reuse of rotated refresh tokens).

### Concurrency Queue (Race-Condition Guard)
To prevent multiple parallel API calls from initiating separate refresh requests upon token expiration, `api.js` tracks refresh status:
- If a 401 is received, `isRefreshing` is set to `true`.
- Subsequent 401 requests are added to `refreshSubscribers` callback array.
- When `refreshAccessToken()` completes, `onTokenRefreshed()` is called, triggering all callbacks with the new token and replaying the requests concurrently.

---

## 4. Comprehensive Relational Data Dictionary

The PostgreSQL database contains **19 tables** structured with foreign key relationships, cascade configurations, and indices for performance.

### 4.1 Authentication & Profile Domain (6 Tables)

#### Table: `api_department`
Stores academic departments.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `name` | `CharField` | `varchar(100)` | | Department name (e.g., Computer Engineering) |
| `code` | `CharField` | `varchar(20)` | Unique | Short code (e.g., COMP) |
| `status` | `CharField` | `varchar(20)` | Default='active' | Active status for registration checks |

#### Table: `api_user`
Custom User model inheriting from Django's `AbstractUser`, substituting email for username.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `email` | `EmailField` | `varchar(254)` | Unique | User login email |
| `password` | `CharField` | `varchar(128)` | | Hashed password string |
| `role` | `CharField` | `varchar(20)` | Default='alumni' | Choice: `admin`, `alumni`, `mentor`, `coordinator` |
| `first_name` | `CharField` | `varchar(150)` | | First Name |
| `last_name` | `CharField` | `varchar(150)` | | Last Name |
| `department_id` | `ForeignKey` | `bigint` | Null=True, FK -> `api_department` | User's engineering department |
| `batch_year` | `IntegerField` | `integer` | Null=True | Year of graduation |
| `phone` | `CharField` | `varchar(20)` | Blank=True | Contact phone number |
| `avatar_url` | `TextField` | `text` | Blank=True | External URL to profile avatar |
| `status` | `CharField` | `varchar(20)` | Default='pending' | Status: `pending`, `approved`, `rejected` |
| `is_superuser` | `BooleanField` | `boolean` | | Global superuser flag |
| `is_staff` | `BooleanField` | `boolean` | | Admin panel login access flag |
| `is_active` | `BooleanField` | `boolean` | Default=True | Account active flag |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Timestamp of registration |
| `updated_at` | `DateTimeField` | `timestamp` | AutoNow | Timestamp of last edit |

#### Table: `api_alumniprofile`
Extended profile details specific to alumni role.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `user_id` | `OneToOneField` | `bigint` | Unique, FK -> `api_user` (Cascade) | Relational owner |
| `date_of_birth` | `DateField` | `date` | Null=True | Date of birth |
| `gender` | `CharField` | `varchar(20)` | Null=True | Gender |
| `nationality` | `CharField` | `varchar(50)` | Null=True | Nationality |
| `degree` | `CharField` | `varchar(100)` | Null=True | Degree title (e.g. B.E. Computer) |
| `current_address` | `TextField` | `text` | Null=True | Location address |
| `languages` | `ArrayField` | `varchar(50)[]` | Blank=True, Default=list | List of languages |
| `current_company` | `CharField` | `varchar(255)` | Null=True | Current employer |
| `current_role` | `CharField` | `varchar(255)` | Null=True | Job role |
| `skills` | `ArrayField` | `varchar(100)[]` | Blank=True, Default=list | Professional skills array |
| `bio` | `TextField` | `text` | Null=True | Short bio description |
| `resume_file_name` | `CharField` | `varchar(255)` | Null=True | Uploaded resume file name |
| `resume_url` | `TextField` | `text` | Null=True | Path to PDF resume storage |
| `resume_size_kb` | `IntegerField` | `integer` | Null=True | Size of document in Kilobytes |
| `resume_last_updated` | `DateTimeField` | `timestamp`| Null=True | Last time resume was updated |

#### Table: `api_mentorprofile`
Extended details specific to mentors.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `user_id` | `OneToOneField` | `bigint` | Unique, FK -> `api_user` (Cascade) | Relational owner |
| `specialization` | `CharField` | `varchar(255)` | | Field of specialization |
| `max_mentees` | `IntegerField` | `integer` | Default=5 | Maximum mentee capacity limit |
| `active_mentees` | `IntegerField` | `integer` | Default=0 | Current count of accepted mentees |

#### Table: `api_usersociallink`
External links for profiles.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `user_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Relational owner |
| `platform` | `CharField` | `varchar(50)` | | Platform identifier (`linkedin`, `github`) |
| `url` | `URLField` | `varchar(200)` | | URL to profile |
| **Unique Constraint**| `unique_together` | | `(user, platform)` | Prevents duplicate links for a platform |

#### Table: `api_userexperience`
Career timeline records for profiles.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `user_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Relational owner |
| `job_title` | `CharField` | `varchar(255)` | | Job title |
| `company_name` | `CharField` | `varchar(255)` | | Employer name |
| `start_date` | `DateField` | `date` | | Date employment started |
| `end_date` | `DateField` | `date` | Null=True | Date employment ended (null = current) |
| `description` | `TextField` | `text` | Blank=True | Job description and projects |
| `is_current` | `BooleanField` | `boolean` | Default=False | Is current job indicator |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Database record creation timestamp |

---

### 4.2 Networking & Mentorship Domain (6 Tables)

#### Table: `api_mentorshiprequest`
Tracks requests for mentorship relationships.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `mentee_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Requesting alumni |
| `mentor_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Target mentor user |
| `message` | `TextField` | `text` | | Cover letter/request detail |
| `status` | `CharField` | `varchar(20)` | Default='pending' | Status: `pending`, `approved`, `rejected` |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Date submitted |
| **Unique Constraint**| `unique_together` | | `(mentee, mentor)` | Limits requests to one per mentor-mentee pair |

#### Table: `api_post`
Social updates feed.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `user_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Post author |
| `post_type` | `CharField` | `varchar(50)` | Default='update' | Type: `update`, `job_share`, `announcement` |
| `content` | `TextField` | `text` | | Text body of the post |
| `media_url` | `TextField` | `text` | Null=True | Attached image/file URL |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Date published |

#### Table: `api_postlike`
Tracks post likes.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `post_id` | `ForeignKey` | `bigint` | FK -> `api_post` (Cascade) | Liked post |
| `user_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | User who liked |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Timestamp of like |
| **Unique Constraint**| `unique_together` | | `(post, user)` | Prevents a user from liking a post multiple times |

#### Table: `api_postcomment`
Replies to feed posts.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `post_id` | `ForeignKey` | `bigint` | FK -> `api_post` (Cascade) | Parent post |
| `user_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Comment author |
| `content` | `TextField` | `text` | | Text body |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Timestamp of comment |

#### Table: `api_message`
Chat message history.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `sender_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Message sender |
| `receiver_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Message recipient |
| `content` | `TextField` | `text` | | Message body |
| `read_status` | `BooleanField` | `boolean` | Default=False | Read receipt flag |
| `sent_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Timestamp sent |

#### Table: `api_notification`
System notifications triggered by activities.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `user_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Target recipient user |
| `title` | `CharField` | `varchar(255)` | | Header text |
| `content` | `TextField` | `text` | | Body details |
| `icon` | `CharField` | `varchar(50)` | Blank=True | Boxicons class (e.g. `bx-briefcase`) |
| `is_read` | `BooleanField` | `boolean` | Default=False | Read status flag |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Timestamp received |

---

### 4.3 Careers & Content Domain (7 Tables)

#### Table: `api_job`
Career postings directory.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `title` | `CharField` | `varchar(255)` | | Job title |
| `company` | `CharField` | `varchar(255)` | | Hiring company name |
| `location` | `CharField` | `varchar(255)` | | Geography |
| `job_type` | `CharField` | `varchar(50)` | | Type: e.g. Full-time, Internship |
| `experience_level` | `CharField` | `varchar(50)` | | Experience requested |
| `description` | `TextField` | `text` | | Detailed job description |
| `posted_by_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Author user |
| `status` | `CharField` | `varchar(20)` | Default='pending_coordinator'| Status: `pending_coordinator`, `pending_admin`, `approved`, `rejected` |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Timestamp created |

#### Table: `api_jobapplication`
Job application tracker.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `job_id` | `ForeignKey` | `bigint` | FK -> `api_job` (Cascade) | Linked job posting |
| `applicant_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Applying alumni user |
| `cover_letter` | `TextField` | `text` | Blank=True | Motivation letter |
| `status` | `CharField` | `varchar(20)` | Default='submitted' | Status: `submitted`, `interviewed`, `accepted`, `rejected` |
| `applied_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Timestamp submitted |
| **Unique Constraint**| `unique_together` | | `(job, applicant)` | Prevents duplicate applications |

#### Table: `api_event`
Seminars, reunions, and events.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `title` | `CharField` | `varchar(255)` | | Event name |
| `description` | `TextField` | `text` | | Description |
| `event_date` | `DateField` | `date` | | Calendar date |
| `event_time` | `TimeField` | `time` | | Event time |
| `location` | `CharField` | `varchar(255)` | | Event venue |
| `category` | `CharField` | `varchar(50)` | | Category: meetup, workshop, sports... |
| `created_by_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Creator user |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Timestamp created |

#### Table: `api_eventattendee`
RSVP registrations mapping for events.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `event_id` | `ForeignKey` | `bigint` | FK -> `api_event` (Cascade) | Target event |
| `user_id` | `ForeignKey` | `bigint` | FK -> `api_user` (Cascade) | Registered attendee user |
| `rsvp_status` | `CharField` | `varchar(20)` | Default='attending' | RSVP: e.g. attending, interested |
| **Unique Constraint**| `unique_together` | | `(event, user)` | Prevents double RSVP mapping |

#### Table: `api_galleryitem`
Photo gallery media files.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `title` | `CharField` | `varchar(255)` | | Image header |
| `category` | `CharField` | `varchar(50)` | | Category: Campus, Reunion, Sports... |
| `image_url` | `TextField` | `text` | | Remote file path |
| `uploaded_by_id`| `ForeignKey` | `bigint` | Null=True, FK -> `api_user` (Set Null) | Uploader user |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Creation timestamp |

#### Table: `api_announcement`
System-wide dashboard notices.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `title` | `CharField` | `varchar(255)` | | Notice title |
| `message` | `TextField` | `text` | | Main text notice body |
| `type_code` | `CharField` | `varchar(50)` | Default='news' | Level: `important`, `news`, `event` |
| `created_at` | `DateTimeField` | `timestamp` | AutoNowAdd | Timestamp created |

#### Table: `api_testimonial`
Landing page reviews card data.
| Column Name | Django Data Type | SQL Type | Constraints | Description |
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `name` | `CharField` | `varchar(100)` | | Alumni name |
| `role` | `CharField` | `varchar(100)` | | Professional designation (e.g. PM) |
| `avatar_url` | `TextField` | `text` | | Picture URL |
| `text` | `TextField` | `text` | | Review text |
| `rating` | `IntegerField` | `integer` | Default=5 | Rating out of 5 stars |
| `is_active` | `BooleanField` | `boolean` | Default=True | Toggles front-page visibility |

#### Table: `api_whyjoin`
Features section cards on index page.
| Column Name | Django Data Type | SQL Type | Constraints | Description|
|---|---|---|---|---|
| `id` | `BigAutoField` | `bigint` | PK | Primary Key |
| `title` | `CharField` | `varchar(100)` | | Feature title |
| `desc` | `TextField` | `text` | | Feature description text |
| `icon` | `CharField` | `varchar(50)` | | Boxicon class (e.g. `bx-group`) |

---

## 5. Request Pipeline & Middleware Order

When a network request is received, it traverses the following pipeline inside Django before returning a response:

1.  **SecurityMiddleware:** Enforces HTTPS redirects, sets XSS/Content-Type security headers, and validates host names.
2.  **CorsMiddleware:** Checks incoming requests against the `CORS_ALLOWED_ORIGINS` settings. If validated, inserts headers allowing JavaScript cross-domain execution.
3.  **SessionMiddleware:** Hydrates session states if session cookies are present.
4.  **CommonMiddleware:** Handles trailing slashes, appends URLs, and manages client content-type mappings.
5.  **CsrfViewMiddleware:** Validates CSRF tokens for write actions (`POST`, `PUT`, `PATCH`, `DELETE`).
6.  **AuthenticationMiddleware:** Binds users to requests if session cookies are present.
7.  **JWTAuthentication (DRF Service):** Intercepts the request, extracts the bearer token from the `Authorization` header, decodes the token, and attaches the matching authenticated `api_user` object as `request.user`.
8.  **Routing Resolver:** Maps URL patterns (e.g. `/api/feed/`) to views.
9.  **Permissions Layer:** Runs view-specific permission classes (e.g., `IsOwnerOrReadOnly` or `IsAdminRole`). If authorization checks fail, returns a `403 Forbidden` or `401 Unauthorized` response.
10. **View Logic Execution:** Executes serializer validation, ORM SQL operations, and compiles database responses.
11. **Serialization Layer:** DRF serializes model objects into structured JSON strings.
12. **Response:** Resolves HTTP headers and returns the compiled JSON payload.
