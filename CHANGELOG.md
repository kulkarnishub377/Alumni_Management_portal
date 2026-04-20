# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
