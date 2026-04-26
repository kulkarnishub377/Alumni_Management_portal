<div align="center">

# 🎓 Alumni Management Portal 🎓

**A full-stack, role-based alumni networking platform built for academic institutions.**
*Connect graduates, coordinate mentorship, manage placements, and build lasting professional communities.*

[![Status](https://img.shields.io/badge/Status-Active%20Development-success?style=flat-square)]()
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS%20·%20ES6%20Modules-F7DF1E?style=flat-square&logo=javascript&logoColor=black)]()
[![Backend](https://img.shields.io/badge/Backend-Django%205.2%20·%20DRF-092E20?style=flat-square&logo=django&logoColor=white)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20·%2019%20Tables-4169E1?style=flat-square&logo=postgresql&logoColor=white)]()
[![Auth](https://img.shields.io/badge/Auth-JWT%20(SimpleJWT)-7C3AED?style=flat-square&logo=jsonwebtokens&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)]()

[**🚀 Live Demo**](https://kulkarnishub377.github.io/Alumni_Management_portal/) &nbsp;·&nbsp; [**📖 API Docs**](docs/API_REFERENCE.md) &nbsp;·&nbsp; [**🗄️ DB Schema**](docs/DATABASE_SCHEMA.md) &nbsp;·&nbsp; [**⚙️ Backend Setup**](docs/BACKEND_SETUP.md)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution &amp; Architecture](#-solution--architecture)
- [Feature Highlights](#-feature-highlights)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Environment Variables](#-environment-variables)
- [Role-Based Access Matrix](#-role-based-access-matrix)
- [Engineering Decisions](#-engineering-decisions)
- [Known Limitations &amp; Roadmap](#-known-limitations--roadmap)
- [Contributing](#-contributing)
- [Authors &amp; License](#-authors--license)

---

## 🧠 Problem Statement

Most universities lose track of their alumni after graduation. Traditional alumni directories are static and offer zero engagement. This creates three critical gaps:

| Gap                                  | Impact                                                            |
| ------------------------------------ | ----------------------------------------------------------------- |
| **No structured mentorship**   | Students lack direct access to experienced industry professionals |
| **No placement analytics**     | Coordinators can't track longitudinal career data by department   |
| **No peer-to-peer networking** | Alumni miss out on batch-level job sharing and community building |

---

## 💡 Solution & Architecture

The Alumni Management Portal solves this by providing a **unified, role-segregated platform** where each user type gets a purpose-built dashboard from the moment they register.

```
┌──────────────────────────────────────────────────────────┐
│                    PUBLIC HOMEPAGE                        │
│              (index.html — no auth required)              │
└──────────────┬───────────────────────────┬───────────────┘
               │ Login / Register          │
               ▼                           ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│   FRONTEND (Port 3000)│    │  BACKEND API (Port 8000)     │
│                       │    │                              │
│  Vanilla JS + ES6     │◄──►│  Django 5.2 + DRF            │
│  Multi-Page App       │    │  JWT Auth (SimpleJWT)        │
│  Glassmorphism CSS    │    │  Role-Based Permissions      │
│  Mock Fallback System │    │  Aggregated API Views        │
└──────────┬────────────┘    └──────────────┬───────────────┘
           │                                │
           │        ┌───────────────┐       │
           └────────┤  PostgreSQL   ├───────┘
                    │  19 Tables    │
                    │  ACID + FK    │
                    └───────────────┘
```

**Key architectural decisions:**

- **Frontend and backend are fully decoupled** — the frontend works independently with mock data (`data.js`) and can be integrated with the live API by replacing `apiFetch` calls.
- **Aggregated API endpoints** (e.g., `HomepageAPIView`) combine 5+ queries into a single response to eliminate frontend waterfall loading.
- **Role-based route guard** — the frontend checks `getUser().role` and routes to the correct dashboard (`/alumni/`, `/mentor/`, `/coordinator/`, `/admin/`).

---

## ✨ Feature Highlights

### 🎓 Alumni Hub

| Feature                         | Description                                                             |
| ------------------------------- | ----------------------------------------------------------------------- |
| **Interactive Dashboard** | Personalized overview with stats, events, jobs, and activity feed       |
| **Profile Management**    | Full CRUD with AI resume parser (drag-and-drop PDF auto-fill)           |
| **Alumni Network**        | Searchable directory with filters by batch, company, role, and name     |
| **Job Board**             | Browse, apply, and post job opportunities with type/experience filters  |
| **Real-time Chat**        | 1:1 messaging and batch group conversations with typing indicators      |
| **Event Registration**    | Browse upcoming events and register with one click                      |
| **Photo Gallery**         | Filterable gallery with lightbox viewer                                 |
| **Mentorship Program**    | View assigned mentor, session schedule, and shared resources            |
| **Notifications**         | Categorized alerts (social, events, jobs, system) with dismiss controls |
| **Settings**              | Toggle notifications, privacy controls, and account security            |

### 💡 Mentor Features

- View and manage mentorship requests (approve/reject with capacity constraints)
- Track active mentees and session schedules
- Post announcements to assigned batches

### ⚙️ Coordinator Features

- Department-scoped analytics and placement tracking
- Job posting approval workflow (pending → approved pipeline)
- Pending alumni registration verification

### 👑 Admin Features

- Platform-wide user management with approve/reject actions
- System health metrics and engagement analytics
- Department, event, and announcement management
- Full CRUD access across all entities

### 🔐 Security & Auth

- JWT-based authentication with automatic token refresh and retry logic
- XSS sanitization via `escapeHTML()` utility
- CSRF protection and CORS whitelist configuration
- Role-based permission classes on all API endpoints
- Password hashing with Django's built-in PBKDF2 algorithm
- Secure environment variable management via `python-decouple`

---

## 🧱 Tech Stack

| Layer                | Technology                                  | Purpose                            |
| -------------------- | ------------------------------------------- | ---------------------------------- |
| **Frontend**   | HTML5, Vanilla JS (ES6 Modules), CSS3       | UI rendering, SPA-like navigation  |
| **Styling**    | Custom Glassmorphism CSS                    | Premium dark-mode aesthetic        |
| **Icons**      | Boxicons 2.1.4                              | UI iconography                     |
| **Fonts**      | Outfit + Inter (Google Fonts)               | Modern typography                  |
| **Backend**    | Python 3.11+, Django 5.2, DRF               | REST API, business logic           |
| **Auth**       | djangorestframework-simplejwt               | JWT token management               |
| **Database**   | PostgreSQL 14+                              | 19-table relational schema         |
| **Security**   | django-cors-headers, python-decouple        | CORS, env secrets                  |
| **Dev Tools**  | concurrently, eslint, prettier              | Parallel dev servers, code quality |
| **Deployment** | Netlify (frontend), any WSGI host (backend) | Static + API hosting               |

---

## 🖼️ Screenshots

<p align="center">
  <img src="Demo_images/home.png" alt="Homepage — Public landing page with hero section, alumni marquee, and feature highlights" width="45%" style="margin: 5px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
  <img src="Demo_images/login.png" alt="Login — Role-based authentication with demo credential hints" width="45%" style="margin: 5px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
</p>
<p align="center">
  <img src="Demo_images/Registration_alumni.jpeg" alt="Registration — Multi-step form with AI resume parser drag-and-drop" width="45%" style="margin: 5px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
  <img src="Demo_images/Alumni_dashbord.png" alt="Alumni Dashboard — Personalized overview with activity feed, events, and quick actions" width="45%" style="margin: 5px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
</p>

> 💡 **Tip:** Visit the [Live Demo](https://kulkarnishub377.github.io/Alumni_Management_portal/) to explore all pages. The frontend runs fully with mock data — no backend needed.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.0+ and **npm** v8.0+
- **Python** v3.11+
- **PostgreSQL** 14+ (running on port 5432)

### 1. Clone & Install

```bash
git clone https://github.com/kulkarnishub377/Alumni_Management_portal.git
cd Alumni_Management_portal

# Install frontend tooling
npm install

# Setup backend (creates venv + installs dependencies)
npm run setup:backend
```

### 2. Configure Database

```bash
# Create the database in PostgreSQL
psql -U postgres -c "CREATE DATABASE alumni_db;"

# Copy environment template and edit with your credentials
cp backend/.env.example backend/.env

# Run migrations
npm run db:migrate

# Create admin account
npm run db:admin
```

### 3. Start Development

```bash
# Run both frontend (port 3000) and backend (port 8000)
npm run dev

# Or individually:
npm run frontend   # http://localhost:3000
npm run backend    # http://localhost:8000/api/
```

### 4. Frontend-Only Mode (No Backend Required)

```bash
npm run frontend
# Navigate to http://localhost:3000
# Use demo credentials on the login page — mock fallback handles everything
```

---

## 📁 Project Structure

```
Alumni_Management_portal/
│
├── assets/                     # Frontend static assets
│   ├── css/
│   │   ├── homepage.css        # Landing page styles
│   │   ├── auth.css            # Login/register styles
│   │   ├── dashboard.css       # Dashboard layout styles
│   │   └── common.css          # Shared design tokens & utilities
│   └── js/
│       ├── homepage.js         # Landing page dynamic rendering
│       ├── dashboard.js        # Full SPA engine (all dashboard views)
│       ├── auth.js             # Login/register/password logic
│       ├── common.js           # Shared utilities (toast, modal, escapeHTML)
│       ├── data.js             # Mock data store for demo mode
│       └── modules/
│           ├── api.js          # JWT fetch wrapper with token refresh
│           └── router.js       # Hash-based SPA router
│
├── pages/                      # Role-segregated UI pages
│   ├── auth/                   # login.html, register.html
│   ├── alumni/                 # dashboard, profile, network, chat, etc.
│   ├── mentor/                 # Mentor-specific dashboard
│   ├── coordinator/            # Coordinator-specific dashboard
│   └── admin/                  # Admin panel pages
│
├── backend/                    # Django REST API
│   ├── api/
│   │   ├── models.py           # 19 Django models (custom User, profiles, etc.)
│   │   ├── views.py            # ViewSets + aggregated API views
│   │   ├── serializers.py      # DRF serializers with computed fields
│   │   ├── urls.py             # Router + custom endpoint mappings
│   │   ├── admin.py            # Django admin configuration
│   │   └── tests.py            # Test suite (20+ tests)
│   ├── config/
│   │   ├── settings.py         # Django settings (env-var based)
│   │   ├── urls.py             # Root URL configuration
│   │   └── wsgi.py             # WSGI entry point
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment variable template
│
├── database/
│   └── schema.sql              # Reference SQL schema
│
├── docs/                       # Technical documentation
│   ├── API_REFERENCE.md        # Complete API endpoint reference
│   ├── DATABASE_SCHEMA.md      # ER diagrams & table documentation
│   └── BACKEND_SETUP.md        # Backend installation guide
│
├── Demo_images/                # Screenshots for README
├── index.html                  # Public landing page
├── package.json                # NPM scripts & dependencies
├── netlify.toml                # Netlify deployment config
├── CHANGELOG.md                # Version history
└── README.md                   # This file
```

---

## 🔌 API Overview

The backend exposes **50+ RESTful endpoints** organized into 5 categories:

| Category                  | Endpoints                                                 | Auth   | Description                      |
| ------------------------- | --------------------------------------------------------- | ------ | -------------------------------- |
| **Authentication**  | `/auth/token/`, `/auth/token/refresh/`                | No     | JWT login & token refresh        |
| **Page Aggregates** | `/pages/homepage/`, `/pages/dashboard/{role}/`        | Varies | Combined data for specific pages |
| **User Management** | `/users/`, `/users/me/`, `/users/{id}/approve/`     | Yes    | CRUD + role actions              |
| **Job Board**       | `/jobs/`, `/jobs/{id}/apply/`, `/job-applications/` | Yes    | Job CRUD + application pipeline  |
| **Mentorship**      | `/mentorship-requests/`, `/{id}/approve/`             | Yes    | Request + approval workflow      |
| **Social Feed**     | `/feed/`, `/feed/{id}/like/`, `/comments/`          | Yes    | Posts, likes, comments           |
| **Messaging**       | `/messages/`, `/{id}/mark_read/`                      | Yes    | 1:1 messaging with read receipts |
| **Content**         | `/events/`, `/gallery/`, `/announcements/`          | Varies | Platform content management      |

> 📖 See [**API_REFERENCE.md**](docs/API_REFERENCE.md) for complete endpoint documentation with payloads and response examples.

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory (see [`.env.example`](backend/.env.example)):

| Variable                       | Default                   | Description                                        |
| ------------------------------ | ------------------------- | -------------------------------------------------- |
| `DJANGO_SECRET_KEY`          | (generated)               | Django secret key —**change in production** |
| `DJANGO_DEBUG`               | `True`                  | Debug mode toggle                                  |
| `DJANGO_ALLOWED_HOSTS`       | `localhost,127.0.0.1`   | Comma-separated allowed hosts                      |
| `DB_NAME`                    | `alumni_db`             | PostgreSQL database name                           |
| `DB_USER`                    | `postgres`              | Database user                                      |
| `DB_PASSWORD`                | `password`              | Database password                                  |
| `DB_HOST`                    | `localhost`             | Database host                                      |
| `DB_PORT`                    | `5432`                  | Database port                                      |
| `CORS_ALLOWED_ORIGINS`       | `http://localhost:3000` | Frontend URLs allowed to call the API              |
| `JWT_ACCESS_TOKEN_LIFETIME`  | `60`                    | Access token lifetime in minutes                   |
| `JWT_REFRESH_TOKEN_LIFETIME` | `1440`                  | Refresh token lifetime in minutes                  |

---

## 🛡️ Role-Based Access Matrix

| Feature                      | Alumni | Mentor | Coordinator | Admin |
| ---------------------------- | :----: | :----: | :---------: | :---: |
| View/edit own profile        |   ✅   |   ✅   |     ✅     |  ✅  |
| Browse alumni network        |   ✅   |   ✅   |     ✅     |  ✅  |
| Apply to jobs                |   ✅   |   ✅   |     —     |  —  |
| Post jobs                    |   ✅   |   ✅   |     ✅     |  ✅  |
| Approve job postings         |   —   |   —   |     ✅     |  ✅  |
| Send/receive messages        |   ✅   |   ✅   |     ✅     |  ✅  |
| Register for events          |   ✅   |   ✅   |     ✅     |  ✅  |
| Create events                |   —   |   —   |     ✅     |  ✅  |
| Request mentorship           |   ✅   |   —   |     —     |  —  |
| Approve/reject mentees       |   —   |   ✅   |     —     |  ✅  |
| Approve/reject registrations |   —   |   ✅   |     —     |  ✅  |
| Manage departments           |   —   |   —   |     —     |  ✅  |
| View system-wide analytics   |   —   |   —   | Dept-scoped |  ✅  |
| Post announcements           |   —   |   —   |     ✅     |  ✅  |

---

## 🐛 Engineering Decisions

### 1. Aggregated API Endpoints

**Problem:** The original design required 5–8 API calls to populate a single dashboard page, causing visible waterfall loading.
**Solution:** Custom `APIView` classes (`HomepageAPIView`, `AlumniDashboardAPIView`, etc.) combine multiple queries into a single JSON response. One request hydrates an entire page.

### 2. Mentorship Capacity Constraints

**Problem:** Popular mentors were overwhelmed with unlimited mentorship requests.
**Solution:** `MentorProfile.max_mentees` is enforced server-side — the `MentorshipRequestViewSet.approve()` action checks capacity before allowing approval and returns a `400` error if the limit is reached.

### 3. JWT Token Refresh with Race-Condition Handling

**Problem:** Multiple concurrent API calls could all detect a 401 and simultaneously attempt token refresh.
**Solution:** The `api.js` module uses a subscriber pattern — only the first 401 triggers a refresh; subsequent requests queue and replay once the new token is available.

### 4. Mock Fallback System

**Problem:** The frontend team needed to develop and demo without a running backend.
**Solution:** The `apiFetch()` wrapper catches network errors and returns structured mock responses for critical endpoints (login, user profile, registration). This allows the entire frontend to function with `npm run frontend` alone.

---

## 🗺️ Known Limitations & Roadmap

### Current Limitations

- **Frontend–Backend integration is pending** — the frontend currently uses `data.js` mock data. All API endpoints are built and ready, but the `apiFetch()` calls need to replace `APP_DATA` references.
- **Chat is HTTP-based** — real-time messaging uses mock auto-replies, not WebSockets.
- **AI Resume Parser is simulated** — the drag-and-drop PDF parser uses mock data extraction (a real LLM integration is planned).
- **No file upload storage** — avatar and resume URLs are stored as strings; actual file upload to S3/media storage is not yet implemented.

### Roadmap

- [ ] **WebSocket messaging** — Upgrade chat from HTTP polling to Django Channels
- [ ] **Real AI resume parser** — Integrate an LLM pipeline for PDF extraction
- [ ] **WebRTC video calls** — Mentor–mentee video conferencing from the dashboard
- [ ] **Email notifications** — SMTP integration for event reminders and job alerts
- [ ] **File uploads** — S3 or local media storage for avatars and resumes
- [ ] **Automated CI/CD** — GitHub Actions pipeline for testing and deployment

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes with descriptive commits
4. Ensure backend tests pass: `npm run test:backend`
5. Push your branch: `git push origin feature/your-feature-name`
6. Open a **Pull Request** with a clear description of changes

### Code Style Guidelines

- **JavaScript:** ES6+ with modular imports; use `escapeHTML()` for all user-rendered content
- **Python:** Follow PEP 8; add docstrings to views and serializers
- **CSS:** Use CSS custom properties from `common.css` for colors and spacing
- **Commits:** Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`)

---

## 📜 Authors & License

### Core Team

| Name                        | Role           | Contact                                                                             |
| --------------------------- | -------------- | ----------------------------------------------------------------------------------- |
| **Shubham Kulkarni**  | Lead Developer | [GitHub](https://github.com/kulkarnishub377) · [Email](mailto:kulkarnishub377@gmail.com) |
| **Yadnynesh Dhangar** | Developer      | [Email](mailto:yadnyneshdhangar@gmail.com)                                             |
| **Aniket Gudgal**     | Developer      | [Email](mailto:aniketgudgal5867@gmail.com)                                             |

### License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Built with ❤️ at DVVPCOE Ahmednagar</b><br>
  <sub>Dr. Vithalrao Vikhe Patil College of Engineering</sub>
</p>
