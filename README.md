<div align="center">

# 🎓 ALUMNI MANAGEMENT PORTAL [v2.0.0]

**An enterprise-grade, full-stack ecosystem engineered for role-based academic networking, mentorship, and career growth.**

[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS%20%7C%20Glassmorphism-blue)]()
[![Backend](https://img.shields.io/badge/Backend-Django%205.2%20%7C%20REST%20Framework-green)]()
[![Authentication](https://img.shields.io/badge/Auth-SimpleJWT%20Tokens-purple)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)]()

**[⭐ View Repository](https://github.com/kulkarnishub377/Alumni_Management_portal)** &nbsp;&bull;&nbsp; **[🚀 Open Frontend Demo](https://kulkarnishub377.github.io/Alumni_Management_portal/)**

</div>

---

## ⚡ 1. Project Philosophy & Overview

The **Alumni Management Portal** is a production-ready Web Application designed to handle the complex, multi-tiered networking pipelines of a modern university. 

It solves the "Black Hole" problem of post-graduation tracking by providing distinct, gamified, and powerful dashboards. It abandons heavy frontend wrappers (like React/Vue) to utilize raw, lightning-fast **Vanilla JavaScript** interacting directly with a highly scalable **Python Django REST API**.

---

## 🔥 2. Exhaustive Feature Breakdown (Role-Based)

This platform natively sandboxes users into strict workspace hierarchies.

### 👑 2.1 The SuperAdmin Interface (`/pages/admin`)
Designed for platform owners and university executives to manage the global system.
- **Global Operations Dashboard**: Aggregate calculations of total network metrics, placement statistics, and user registration velocity.
- **Verification Engine**: Newly registered alumni remain in a `pending` state until visually verified and approved by the SuperAdmin.
- **Master User Directory**: Full tabular manipulation of every registered entity (Students, Mentors, Staff) with advanced search.
- **Global Event Management**: Push universal announcements or MEGA events (like campus reunions) to all dashboard feeds instantly.

### 🎓 2.2 The Alumni Experience (`/pages/alumni`)
The core engagement hub for graduates and students.
- **Interactive Activity Feed**: A social-media style interactive wall natively supporting multimedia. Users can post, like, and comment on network activity.
- **Integrated Job Hub (`jobs.html`)**: View thousands of approved opportunities (Internship, Full-time). Includes an interactive `JobApplication` backend logic tied directly to the user's uploaded resume.
- **Interactive Network Directory`: Filter and discover peers by Company, Batch Year, or specific technical Skills. Send instant connection protocols.
- **Mentorship Discovery Layer**: Browse verified Mentors based on specific industry specializations. Request formal guidance tracks natively.
- **Total Profile Customization**: Upload avatars, establish nested Experience Timelines, manage social links (Github/LinkedIn), and declare dynamic `skills` arrays.
- **Masonry Memory Galleries**: High-performance interactive masonry image loading to maintain university nostalgia.

### 💡 2.3 The Mentor Command Center (`/pages/mentor`)
Specialized interface for senior alumni looking to guide the next generation.
- **Approvals Kanban Board (`approvals.html`)**: Interactive pipeline to Accept, Defer, or Deny incoming mentee requests based on current workload constraints (e.g., `max_mentees = 5`).
- **Mentee Roster & Export Module**: Centralized metrics on accepted students.
- **Batch Comm Center**: Broadcast messages, schedule localized group events, or initiate 1-on-1 private timelines exclusively with accepted mentees.

### ⚙️ 2.4 The Coordinator Workflow (`/pages/coordinator`)
Designed for localized Department Heads.
- **Job Board Moderation**: Alumni/Corporate job postings fall into a `pending_coordinator` state. Faculty must vet the payload before releasing it to the Global Alumni Job Board.
- **Departmental Analytics**: Dashboards locked specifically to the statistics of their faculty tracking.

---

## 🛠️ 3. Complete Technology Stack

| Architecture Layer | Technology Framework         | Rationale for Selection                                                                 |
|--------------------|------------------------------|-----------------------------------------------------------------------------------------|
| **Frontend UI**    | HTML5 Semantic, CSS3 Custom  | Absolute zero-dependency styling. Utilizes advanced CSS `var()` tokens for Glassmorphism. |
| **Frontend Logic** | ES6 Vanilla JavaScript       | Lightning-fast DOM manipulation via isolated `module.js` files perfectly decoupled.       |
| **Backend API Core**| Python 3.11+, Django 5.2     | Unparalleled ORM stability and a completely pre-built integrated SuperAdmin Back-Office.  |
| **API Endpoints**  | Django REST Framework (DRF)  | Highly optimized nested data Serialization natively integrating with Token securities.    |
| **Authentication** | djangorestframework-simplejwt| Stateless, enterprise-grade JSON Web Token authorization bridging Javascript and Python.  |
| **Database Engine**| PostgreSQL 14+               | Powerful ACID relational mappings essential for massive networking timelines.           |

---

## 🗄️ 4. Advanced Django Architecture

Unlike standard generic CRUD systems, this application utilizes **Page-Wise Aggregated APIs** to eliminate frontend loading bottlenecks. 

By fetching a single aggregate route (e.g. `GET /api/pages/homepage/`), the Django Backend processes concurrent database queries (combining Stats, Top Alumni limits, Job arrays, and Events) and ships them as perfectly grouped JSON payloads.

**Interactive Business Logic** features natively built into Django `@action` methods include:
- `MentorshipRequestViewSet.approve()`
- `JobApplicationViewSet.apply()` 
- `PostLikeViewSet.toggle()`

---

## 🚀 5. Comprehensive Execution Guide

Starting this full-stack integration locally is extremely straightforward. 

### Step A: PostgreSQL Provisioning
You must run a PostgreSQL cluster on `localhost:5432`.
1. Open your Postgres CLI (`psql`) or pgAdmin.
2. Formulate the database: `CREATE DATABASE alumni_db;`
*(Default backend credentials expect user="postgres" and password="password". Update `backend/config/settings.py` -> `DATABASES` if yours are different).*

### Step B: Initializing the Django Backend API
Open a terminal in the root project folder:
```bash
# 1. Navigate into the backend environment
cd backend

# 2. Spin up a secure virtual python space
python -m venv venv

# 3. Activate the environment (Windows Example)
.\venv\Scripts\activate
# (Mac/Linux users: source venv/bin/activate)

# 4. Install massive server dependencies
pip install -r requirements.txt

# 5. Execute structural Data Migrations to your Postgres Database
python manage.py makemigrations api
python manage.py migrate

# 6. Create your master UI account
python manage.py createsuperuser

# 7. Start the API Gateway
python manage.py runserver
```
*The API is now permanently broadcasting on `http://127.0.0.1:8000/api/`*

### Step C: Launching the Frontend Application
Leave the backend terminal running. Open a **new** terminal.
Because the UI is perfectly decoupled Vanilla HTML, you simply need a native file-server:
```bash
npx serve .
```
Navigate to `http://localhost:3000` (or whatever port `serve` generated). The frontend interface will load perfectly and is structurally ready to send HTTP payload queries to your new Django Core!

---

## 🛡️ 6. Security & Sandboxing Architecture

**Frontend Perspective:** By strictly enforcing internal directory routing (`/pages/admin/`, `/pages/mentor/`), standard users cannot natively navigate across visualization scripts they are not permitted to render.

**Backend Perspective:** Django Rest Framework locks every single API method with `permission_classes`.
- `IsAuthenticated` protects all Private data routes.
- The `SimpleJWT` verification class denies all transactions lacking active tokens.
- Specialized actions (like Mentorship Approvals) verify if `request.user.id == target_mentor.id`, completely preventing cross-account payload injections.

---

## 📂 7. Project Source Map

```text
📦 Alumni_Management_portal
 ┣ 📂 backend                     # ⚙️ Django API Core
 ┃ ┣ 📂 api                       # REST logic (models.py, views.py, urls.py)
 ┃ ┣ 📂 config                    # Environment Configs (settings.py, urls.py)
 ┃ ┣ 📜 manage.py                 
 ┃ ┗ 📜 requirements.txt          
 ┣ 📂 docs                        # 📚 Advanced Technical Reference
 ┃ ┣ 📜 API_REFERENCE.md          # Complete Payload Documentations
 ┃ ┣ 📜 BACKEND_SETUP.md          # Granular Execution instructions
 ┃ ┗ 📜 DATABASE_SCHEMA.md        # Specialized ORM Definitions
 ┣ 📂 database                    # 🗄️ Original Schema Exports
 ┣ 📜 index.html                  # Landing Page
 ┣ 📂 assets                      # UI Styling and Object engines
 ┗ 📂 pages                       # 🛡️ Role-Based Sandboxes (/admin, /alumni, /auth...)
```

<br>
<p align="center"><b>Engineered systematically with ❤️ to build next-generation Alumni Communities.</b></p>
<br>
