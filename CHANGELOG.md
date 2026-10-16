# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-04-21

### Added
- **`requirements.txt`** — Backend dependencies are now properly pinned and documented.
- **`.env.example`** — Environment variable template for secure configuration.
- **`PasswordChangeSerializer`** and `POST /api/users/change_password/` endpoint.
- **`CoordinatorDashboardAPIView`** — Aggregated coordinator-specific data endpoint.
- **`AdminDashboardAPIView`** — Aggregated admin-specific data endpoint.
- **Custom permission classes** — `IsOwnerOrReadOnly`, `IsAdminRole`, `IsCoordinatorOrAdmin`, `IsMentorOrAdmin`.
- **User approve/reject actions** — `POST /api/users/{id}/approve/` and `/reject/`.
- **Job approval pipeline** — `POST /api/jobs/{id}/approve_job/` and `/reject_job/`.
- **Message read receipts** — `PATCH /api/messages/{id}/mark_read/` and bulk `mark_all_read`.
- **Notification management** — `mark_read` and `mark_all_read` actions on notifications.
- **JWT token refresh logic** in `api.js` with race-condition handling via subscriber pattern.
- **`changePassword()`** export function in `api.js`.
- **Backend test suite** — 20+ tests covering registration, auth, permissions, and homepage API.
- **`test:backend`** npm script for running Django tests.
- **Auto-initialization** of `initScrollTop()` and `initPreloader()` via DOMContentLoaded in `common.js`.
- **`togglePassword()`** shared helper in `common.js` for login/register pages.

### Changed
- **`settings.py`** — All secrets (SECRET_KEY, DB credentials) now loaded from environment variables via `python-decouple` with graceful fallback.
- **`CORS_ALLOW_ALL_ORIGINS`** replaced with **`CORS_ALLOWED_ORIGINS`** whitelist.
- **`UserSerializer`** — Added `password` to `fields` (was silently ignored). Password is write-only and properly hashed via `set_password()` on create and update.
- **`UserViewSet`** — Restricted to `AllowAny` only for `create` action. Added `me` endpoint with GET and PATCH support.
- **`HomepageAPIView`** — Removed hardcoded stat inflation (was adding +12500 to actual counts).
- **All ViewSets** — Added proper role-based permission classes instead of relying solely on global defaults.
- **`MessageViewSet`** — Scoped queryset to sender/receiver only (users can no longer see all messages).
- **`NotificationViewSet`** — Scoped queryset to the authenticated user only.
- **`JobApplicationViewSet`** — Users see only their own applications; admins see all.
- **`common.js`** — Standardized localStorage on single `user_info` key (removed dual `alumni_portal_user` path).
- **`api.js`** — 401 handler now attempts token refresh before clearing auth. Added demo fallback for password change.
- **`package.json`** — Fixed `clean` script for cross-platform (`npx rimraf`), fixed `setup:backend` to use `python -m pip`, removed unused `dotenv` dependency.

### Fixed
- **Critical:** User registration password was silently ignored — passwords are now properly hashed.
- **Critical:** `UserViewSet` was fully public (`AllowAny`) — anyone could list, update, or delete users.
- **Security:** Hardcoded `SECRET_KEY` and database credentials removed from source control.
- **Security:** `CORS_ALLOW_ALL_ORIGINS = True` replaced with explicit origin whitelist.
- **Bug:** Homepage stats were inflated with hardcoded offsets that would double-count real users.
- **Bug:** `initScrollTop()` and `initPreloader()` were defined but never called (dead code).
- **Bug:** `setUser()` wrote to `alumni_portal_user` while `api.js` wrote to `user_info` — inconsistent state.
- **Bug:** `setup:backend` npm script used global `pip` instead of the venv's pip.
- **Bug:** `clean` npm script used `rm -rf` which doesn't work on Windows.

### Documentation
- **README.md** — Complete professional rewrite with architecture diagrams, feature matrix, tech stack table, role-based access matrix, env vars documentation, and contributing guidelines.
- **API_REFERENCE.md** — Now documents all 50+ endpoints with auth requirements, payloads, and response examples.
- **DATABASE_SCHEMA.md** — Updated to cover all 19 tables (up from 15) with Mermaid ER diagram and detailed column tables.

---

## [2.0.0] - 2026-04-20

### Added
- **Full-Stack Django Backend Integration**.
- **PostgreSQL Database** for real-world scaling replacing local JS states.
- Advanced REST APIs with Django Rest Framework (DRF).
- Token-Based User Authentication (SimpleJWT).
- `JobApplication` pipelines and `MentorshipRequest` native tables.
- Interactive backend endpoints for Direct Messaging, Post Liking, and Job Approvals.

### Changed
- Project configuration mutated from pure Frontend to Decoupled Full-Stack.
- `package.json` bumped and documentation relocated to `/docs`.

---

## [1.0.0] - 2026-04-16

### Added
- Complete Decoupled multi-page Architecture for routing.
- High-performance, vanilla JavaScript DOM manipulations for intersection observing and modals.
- Centralized `assets/js/data.js` single-source-of-truth datastore.
- Role-specific sub-directories (`/admin`, `/alumni`, `/coordinator`, `/mentor`, `/auth`).
- Advanced Glassmorphism CSS UI system.
- Real-time Alumni Marquee with pausing capabilities.
- Dynamic Masonry Gallery with intelligent Lightbox.
- Professionally structured and exhaustive documentation (`README.md` per folder).

### Changed
- Hero layout updated to a clean, highly professional static layout to emphasize core networking metrics.
- Completely removed legacy Single Page Application (SPA) routing in favor of secure routing boundaries.

### Security
- UI components strictly boxed into role permissions via directory access.
